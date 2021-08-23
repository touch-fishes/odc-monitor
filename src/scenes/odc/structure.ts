import * as THREE from 'three';

import {
    coffeeTableStation,
    floor,
    kitchenStation,
    northSofaStation,
    WALL_HEIGHT,
    WALL_THICKNESS,
    walls,
} from '@/data/buildings-data';
import {
    AreaSeats,
    northWorkstation,
    northWorkstationArea,
    SeatAreaType,
    southWorkstation,
    southWorkstationArea,
} from '@/data/workstations-data';
import { ModelLine, ModelPointer } from '@/scenes/types';
import { Kitchen } from '@/scenes/odc/model/kitchen/kitchen';
import { Sofa } from '@/scenes/odc/model/sofa/sofa';
import { CoffeeTable } from '@/scenes/odc/model/coffee-table/coffee-table';
import { getCenterOfModelArea, scale } from '@/scenes/util/location';
import { keyPointPositions } from '@/data/key-point-data';
import { KeyPoint } from '@/scenes/odc/model/key-point/key-point';
import { Floor } from '@/scenes/odc/model/floor/floor';
import { Workstation } from '@/scenes/odc/model/workstation/workstation';
import { globalEvent } from '@/scenes/odc/event';
import { ExternalWall } from '@/scenes/odc/model/wall/external-wall';
import { GlassWall } from '@/scenes/odc/model/wall/glass-wall';
import { InnerWall } from '@/scenes/odc/model/wall/inner-wall';
import { p } from '@/scenes/util/path';
import {
    CameraMonitorItem,
    northCameraMonitors,
    southCameraMonitors,
} from '@/data/camera-monitor-data';
import { CameraMonitor } from '@/scenes/odc/model/camera-monitor/camera-monitor';

export class Structure extends THREE.Group {
    private readonly kitchen: Kitchen;
    private readonly northSofa: Sofa;
    private readonly coffeeTable: CoffeeTable;
    private readonly floor: Floor;
    private walls: (GlassWall | ExternalWall | InnerWall)[];

    private readonly northWorkstation: Workstation;
    private readonly southWorkstation: Workstation;
    private readonly keyPoints: KeyPoint[];
    private readonly southCameraMonitors: CameraMonitor[];
    private readonly northCameraMonitors: CameraMonitor[];

    public constructor() {
        super();
        this.kitchen = this.renderKitchen();
        this.northSofa = this.renderNorthSofa();
        this.coffeeTable = this.renderCoffeeTable();
        this.floor = this.renderFloor();
        this.keyPoints = this.renderKeyPoints();
        this.walls = this.renderWall();
        this.southCameraMonitors = this.renderCameraMonitor(SeatAreaType.south);
        this.northCameraMonitors = this.renderCameraMonitor(SeatAreaType.north);
        this.northWorkstation = this.renderStation(
            northWorkstationArea,
            northWorkstation,
            SeatAreaType.north,
        );
        this.southWorkstation = this.renderStation(
            southWorkstationArea,
            southWorkstation,
            SeatAreaType.south,
        );
        this.add(this.kitchen);
        this.add(this.northSofa);
        this.add(this.coffeeTable);
        this.add(this.floor);
        this.add(this.northWorkstation);
        this.add(this.southWorkstation);
        this.keyPoints.forEach((keyPoint) => this.add(keyPoint));
        this.walls.forEach((wall) => this.add(wall));
        this.southCameraMonitors.forEach((cameraMonitor) => this.add(cameraMonitor));
        this.northCameraMonitors.forEach((cameraMonitor) => this.add(cameraMonitor));
        this.addObserver();
    }

    public getMonitors() {
        return {
            south: this.southCameraMonitors,
            north: this.northCameraMonitors,
        };
    }

    private addObserver() {
        globalEvent.dispatchEvent({
            type: 'addClickObserver',
            message: [this.northWorkstation],
        });
        globalEvent.dispatchEvent({
            type: 'addClickObserver',
            message: [this.southWorkstation],
        });
        globalEvent.dispatchEvent({ type: 'addClickObserver', message: this.keyPoints });
        globalEvent.dispatchEvent({
            type: 'addClickObserver',
            message: this.northCameraMonitors,
        });
        globalEvent.dispatchEvent({
            type: 'addClickObserver',
            message: this.southCameraMonitors,
        });
    }

    private renderKitchen = () => {
        const { begin, end } = kitchenStation;
        const { x, z } = getCenterOfModelArea(begin as ModelPointer, end as ModelPointer);
        const kitchen = new Kitchen();
        kitchen.position.z = z;
        kitchen.position.x = x;
        return kitchen;
    };

    private renderNorthSofa = () => {
        const { begin, end } = northSofaStation;
        const { x, z } = getCenterOfModelArea(begin as ModelPointer, end as ModelPointer);
        return new Sofa(begin, end, { x, z });
    };

    private renderCoffeeTable = () => {
        const { begin, end } = coffeeTableStation;
        const { x, z } = getCenterOfModelArea(begin as ModelPointer, end as ModelPointer);
        return new CoffeeTable({ x, z });
    };

    private renderKeyPoints() {
        return keyPointPositions.map((item) => {
            const { begin, end } = item;
            const { x, z } = getCenterOfModelArea(begin as ModelPointer, end as ModelPointer);
            const keyPoint = new KeyPoint(20);
            keyPoint.position.z = z;
            keyPoint.position.y = scale(WALL_HEIGHT);
            keyPoint.position.x = x;
            keyPoint.userData.isSideKeypoint = item.type === 'side';
            return keyPoint;
        });
    }

    private renderFloor() {
        return new Floor(
            floor.begin.map((itm) => scale(itm)) as ModelPointer,
            floor.end.map((itm) => scale(itm)) as ModelPointer,
        );
    }

    private renderStation(workStationArea: ModelLine, workStation: AreaSeats, type: SeatAreaType) {
        const { begin, end } = workStationArea;
        const { x, z } = getCenterOfModelArea(begin, end);
        const [beginX, beginY] = begin.map((element) => scale(element));
        const [endX, endY] = end.map((element) => scale(element));
        const theWorkstation = new Workstation(
            {},
            { xLength: endY - beginY, zLength: endX - beginX },
            workStation,
            type,
        );
        theWorkstation.position.x = x;
        theWorkstation.position.z = z;
        theWorkstation.name = `${type}Workstation`;
        return theWorkstation;
    }

    private renderWall() {
        return walls.map(({ type, begin, end }) => {
            const [beginPointer, endPointer, height, thickness] = [
                begin.map((item) => scale(item)) as ModelPointer,
                end.map((item) => scale(item)) as ModelPointer,
                scale(WALL_HEIGHT),
                scale(WALL_THICKNESS),
            ];
            return type === 'external'
                ? new ExternalWall(beginPointer, endPointer, height, thickness)
                : (type === 'glass'
                ? new GlassWall(beginPointer, endPointer, height, thickness)
                : new InnerWall(beginPointer, endPointer, height, thickness));
        });
    }

    private renderCameraMonitor(areaType: SeatAreaType) {
        const map = new THREE.TextureLoader().load(p('/texture/camera-monitor.png'));
        return areaType === SeatAreaType.south
            ? this.generateCameraMonitor(southCameraMonitors, map, areaType)
            : this.generateCameraMonitor(northCameraMonitors, map, areaType);
    }

    private generateCameraMonitor(
        cameraMonitors: CameraMonitorItem[],
        map: THREE.Texture,
        areaType: SeatAreaType,
    ) {
        return cameraMonitors.map((cameraMonitorPosition) => {
            const { begin, end, observedSeatRowIndex } = cameraMonitorPosition;
            const { x, z } = getCenterOfModelArea(begin as ModelPointer, end as ModelPointer);
            return new CameraMonitor(
                map,
                { x, y: scale(WALL_HEIGHT), z },
                { areaType, observedSeatRowIndex },
            );
        });
    }
}
