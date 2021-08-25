import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

import { Desktop } from '../desktop/desktop';
import { KeyPoint } from '../key-point/key-point';
import { globalEvent } from '../../event';

import { getSize } from '@/scenes/util/object-3d';
import { SeatInfo } from '@/data/workstations-data';
import { p } from '@/scenes/util/path';
import {EventType} from "@/scenes/odc/types";

export class Seat extends THREE.Group {
    public static clazzName = 'seat';

    private static resource: Record<string, undefined | THREE.Object3D> = {
        tableObject3D: undefined,
    };

    public static loadResource(loadingManager: THREE.LoadingManager) {
        return new Promise((resolve) => {
            const objLoader = new OBJLoader(loadingManager);
            objLoader.load(p('/3d-model/table/table.obj'), (obj) => {
                Seat.resource.tableObject3D = obj;
                resolve({ tableObject3D: obj });
            });
        });
    }

    public readonly table: THREE.Object3D;
    public readonly keyPoint: KeyPoint;
    public readonly desktop: Desktop;
    public readonly light: THREE.SpotLight;

    public constructor(seatInfo: SeatInfo) {
        const theSeatInfo = seatInfo || {};
        super();
        // 桌子为外部模型
        this.table = this.createTable();
        this.keyPoint = this.createKeyPoint(theSeatInfo);
        this.desktop = this.createDeskTop(theSeatInfo);
        this.light = this.createLight();
        this.userData.clazzName = Seat.clazzName;
        this.userData.id = `${seatInfo.code}`;
        this.add(this.table);
        this.add(this.keyPoint);
        this.add(this.desktop);
        this.add(this.light);
        // TODO 延时加载观测点 注视方向
        // eslint-disable-next-line no-promise-executor-return
        new Promise((resolve) => resolve(true)).then(() => {
            this.locationKeyPoint();
        });
    }

    public lightOff() {
        this.light.visible = false;
    }

    public lightOn() {
        this.light.visible = true;
    }

    private locationKeyPoint() {
        const { y: heightY } = this.getWorldPosition(new THREE.Vector3());
        const { x: lookX } = this.desktop.getWorldPosition(new THREE.Vector3());
        const { x: keyPointX, z: keyPointZ } = this.keyPoint.getWorldPosition(new THREE.Vector3());
        const lockAtPosition = new THREE.Vector3(
            lookX > keyPointX ? keyPointX + 100 : keyPointX - 100,
            heightY + 16,
            keyPointZ,
        );
        this.keyPoint.setLookAt(lockAtPosition);
    }
    private createLight() {
        const topLight = new THREE.SpotLight('rgb(245,108,108)', 2, 180);
        const { x: lookAtX, y: lookAtY, z: lookAtZ } = this.table.position;
        topLight.position.set(lookAtX + 2, lookAtY + 20, lookAtZ);
        topLight.target = this.table;
        // 光照强度
        topLight.decay = 2;
        topLight.visible = false;
        return topLight;
    }
    private createKeyPoint(theSeatInfo: SeatInfo) {
        const keyPoint = new KeyPoint();
        keyPoint.addClickCallback(() =>
            globalEvent.dispatchEvent({ type: EventType.showSeatInfo, message: theSeatInfo }),
        );
        const { x: tableX } = getSize(this.table);
        keyPoint.position.y = 10;
        keyPoint.position.x = -tableX - 6;
        // 添加观测事件
        globalEvent.dispatchEvent({ type: 'addClickObserver', message: [keyPoint] });
        return keyPoint;
    }
    private createDeskTop(seatInfo: SeatInfo) {
        const desktopName = `desktop_${seatInfo.rowCode}`;
        const desktop = new Desktop(desktopName, seatInfo);
        desktop.name = desktopName;
        desktop.scale.set(0.25, 0.25, 0.25);
        const { z: tableZ, y: tableY } = getSize(this.table);
        desktop.position.y = tableY;
        desktop.position.z = this.table.position.z - tableZ / 4;
        return desktop;
    }
    private createTable() {
        if (!Seat.resource.tableObject3D) throw new Error('No Resource');
        const table = Seat.resource.tableObject3D.clone();
        // 单张桌子长度
        // const { x, z } = getSize(table);
        // 能放桌子的区域 比 目前桌子长
        // TODO scale 计算错误
        // const scale = (zLength / seats.length - 1) / x;
        const scale = 0.25;
        table.rotation.x = -Math.PI / 2;
        table.rotation.z = Math.PI / 2;
        table.scale.set(scale, scale, scale);
        return table;
    }
}
