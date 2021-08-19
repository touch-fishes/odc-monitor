import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { Object3D } from 'three';

import { Mousemove } from './event/mousemove';
import { Click } from './event/click';
import { globalEvent } from './event';
import { Floor } from './model/floor/floor';
import { GlassWall } from './model/wall/glass-wall';
import { Seat } from './model/seat/seat';
import { InnerWall } from './model/wall/inner-wall';
import { ExternalWall } from './model/wall/external-wall';
import { Workstation } from './model/workstation/workstation';
import { Monitor } from './model/monitor/monitor';
import { KeyPoint } from './model/key-point/key-point';
import { createHighlightElement } from './util/highlight';

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
import { keyPointPositions } from '@/data/key-point-data';
import { ModelLine, ModelPointer } from '@/scenes/types';
import { CoffeeTable } from '@/scenes/odc/model/coffee-table/coffee-table';
import { Sofa } from '@/scenes/odc/model/sofa/sofa';
import { Kitchen } from '@/scenes/odc/model/kitchen/kitchen';
import { CameraMonitor } from '@/scenes/odc/model/camera-monitor/camera-monitor';
import { cameraMonitorPositions } from '@/data/camera-monitor-data';

interface InitModelObj3D {
    coffeeTableObj3D: { coffeeTableObj3D: Object3D };
    sofaObj3D: { sofaObj3D: Object3D };
    kitchenObj3D: { kitchenObj3D: Object3D };
}

// import { AppleHost } from './model/computer-host/apple-host';

export const loadODCResource = () => {
    return Promise.all([
        CoffeeTable.loadCoffeeTableResource(),
        Sofa.loadNorthSofaResource(northSofaStation),
        Kitchen.loadKitchenResource(),
        Monitor.loadResource(),
        // AppleHost.loadResource(),
        Seat.loadResource(),
    ]);
};

export class ODC {
    private readonly odcGroup: THREE.Group;
    private readonly renderer: THREE.WebGLRenderer;
    private readonly camera: THREE.PerspectiveCamera;
    private readonly scene: THREE.Scene;
    private highlightComposer: EffectComposer;
    private readonly highlightOutlinePass: OutlinePass;
    private readonly controls: OrbitControls;
    private stats: Stats;
    private readonly northWorkstation: Workstation;
    private readonly southWorkstation: Workstation;
    private readonly keyPoints: any[];

    public constructor({ coffeeTableObj3D, sofaObj3D, kitchenObj3D }: InitModelObj3D) {
        this.odcGroup = new THREE.Group();

        this.renderer = this.initRender();

        this.camera = this.initCamera();

        this.scene = this.initScene();

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        // @ts-ignore
        this.stats = new Stats();

        this.initHelp();

        this.initLight();

        // 事件准备
        const { composer, outlinePass } = createHighlightElement(
            this.scene,
            this.camera,
            this.renderer,
        );
        this.highlightComposer = composer;
        this.highlightOutlinePass = outlinePass;

        this.initEvent();

        // 渲染墙体结构
        this.renderWall();

        // 渲染地面
        this.renderFloor();

        // 渲染 ODC 工位
        this.northWorkstation = this.renderStation(
            southWorkstationArea,
            southWorkstation,
            SeatAreaType.south,
        );
        this.odcGroup.add(this.northWorkstation);
        globalEvent.dispatchEvent({
            type: 'addClickObserver',
            message: [this.northWorkstation],
        });
        this.southWorkstation = this.renderStation(
            northWorkstationArea,
            northWorkstation,
            SeatAreaType.north,
        );
        this.odcGroup.add(this.southWorkstation);
        globalEvent.dispatchEvent({
            type: 'addClickObserver',
            message: [this.southWorkstation],
        });

        // 渲染厨房
        this.renderKitchen(kitchenObj3D);

        this.renderNorthSofa(sofaObj3D);
        //
        // // 北区茶几
        this.renderCoffeeTable(coffeeTableObj3D);
        //
        // // 渲染区域内监控摄像头
        this.renderCameraMonitor();

        this.keyPoints = this.renderKeyPoints();
        globalEvent.dispatchEvent({ type: 'addClickObserver', message: this.keyPoints });

        this.scene.add(this.odcGroup);

        this.locationODC();

        this.animate();
    }

    private initEvent() {
        // TODO
        // document.getElementById('#switch-btn').addEventListener( 'click', (event) => {
        // 	animateOrbitCamera(
        // 		{camera: this.camera, controls: this.controls},
        // 		{cameraPosition: this.camera.position, orbitTargetPosition: this.controls.target },
        // 		{ cameraPosition: this.oldCamera.position, orbitTargetPosition: this.oldControls.target }
        // 	)
        // });
        window.addEventListener('resize', (event) => {
            if (this.camera && this.renderer) {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            }
        });
        // 移动事件
        const mousemoveEvent = new Mousemove({
            camera: this.camera,
            highlightOutlinePass: this.highlightOutlinePass,
        });
        globalEvent.addEventListener('addMousemoveObserver', ({ message }) =>
            mousemoveEvent.addObservers(message),
        );
        // 点击事件
        const clickEvent = new Click({
            camera: this.camera,
            highlightOutlinePass: this.highlightOutlinePass,
            controls: this.controls,
        });
        globalEvent.addEventListener('addClickObserver', ({ message }) =>
            clickEvent.addObservers(message),
        );
    }

    private initHelp() {
        this.controls.screenSpacePanning = false;
        this.controls.maxPolarAngle = Math.PI / 2;
        // 坐标轴
        const axesHelper = new THREE.AxesHelper(100);
        axesHelper.position.set(0, 100, 0);
        this.scene.add(axesHelper);
        document.body.append(this.stats.dom);
        // this.scene.add(new THREE.GridHelper(2000, 50));
    }

    private initLight() {
        const ambientLight = new THREE.AmbientLight(0x606060);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(1, 0.75, 0.5).normalize();
        this.scene.add(directionalLight);
    }

    private initCamera() {
        const camera = new THREE.PerspectiveCamera(
            50,
            window.innerWidth / window.innerHeight,
            1,
            6000,
        );
        camera.position.set(-712, 1000, -712);
        camera.lookAt(0, 0, 0);
        return camera;
    }

    private initScene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#0a0a0a');
        return scene;
    }

    private initRender() {
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.append(renderer.domElement);
        return renderer;
    }

    private animate() {
        requestAnimationFrame(this.animate.bind(this));
        TWEEN.update();
        this.stats.update();
        this.highlightComposer.render();
    }

    private scale(measurement: number) {
        const measurementLength = 71200;
        const viewLength = 1600;
        return (measurement * viewLength) / measurementLength;
    }

    private renderWall() {
        walls.forEach(({ type, begin, end }) => {
            const [beginPointer, endPointer, height, thickness] = [
                begin.map((item) => this.scale(item)) as ModelPointer,
                end.map((item) => this.scale(item)) as ModelPointer,
                this.scale(WALL_HEIGHT),
                this.scale(WALL_THICKNESS),
            ];
            const wall =
                type === 'external'
                    ? new ExternalWall(beginPointer, endPointer, height, thickness)
                    : (type === 'glass'
                    ? new GlassWall(beginPointer, endPointer, height, thickness)
                    : new InnerWall(beginPointer, endPointer, height, thickness));
            this.odcGroup.add(wall);
        });
    }

    // TODO
    private renderStation(workStationArea: ModelLine, workStation: AreaSeats, type: SeatAreaType) {
        const { begin, end } = workStationArea;
        const { x, z } = this.getCenterOfModelArea(begin, end);
        const [beginX, beginY] = begin.map((element) => this.scale(element));
        const [endX, endY] = end.map((element) => this.scale(element));
        const theWorkstation = new Workstation(
            {},
            { xLength: endY - beginY, zLength: endX - beginX },
            workStation,
            type,
        );
        theWorkstation.position.x = x;
        theWorkstation.position.z = z;
        theWorkstation.name = `${type}Workstation`;
        if (type === SeatAreaType.north) {
            // this.northWorkstation = theWorkstation;
            // this.odcGroup.add(this.northWorkstation);
            // return theWorkstation;
            globalEvent.dispatchEvent({
                type: 'addClickObserver',
                message: [this.northWorkstation],
            });
        }
        if (type === SeatAreaType.north) {
            // this.southWorkstation = theWorkstation;
            // this.odcGroup.add(this.southWorkstation);
            // globalEvent.dispatchEvent({
            //     type: 'addClickObserver',
            //     message: [this.southWorkstation],
            // });
        }
        return theWorkstation;
    }

    private renderKitchen(kitchenObj3D: { kitchenObj3D: Object3D }) {
        const { begin, end } = kitchenStation;
        const { x, z } = this.getCenterOfModelArea(begin as ModelPointer, end as ModelPointer);
        const kitchen = new Kitchen(kitchenObj3D);
        kitchen.position.z = z;
        kitchen.position.x = x;
        this.odcGroup.add(kitchen);
    }

    private renderNorthSofa(sofaObj3D: { sofaObj3D: Object3D }) {
        const { begin, end } = northSofaStation;
        const { x, z } = this.getCenterOfModelArea(begin as ModelPointer, end as ModelPointer);
        this.odcGroup.add(new Sofa(sofaObj3D, begin, end, { x, z }));
    }

    private renderCoffeeTable(coffeeTableObj3D: { coffeeTableObj3D: Object3D }) {
        const { begin, end } = coffeeTableStation;
        const { x, z } = this.getCenterOfModelArea(begin as ModelPointer, end as ModelPointer);
        this.odcGroup.add(new CoffeeTable(coffeeTableObj3D, { x, z }));
    }

    private renderCameraMonitor() {
        const cameraMonitors: Object3D[] = [];
        const map = new THREE.TextureLoader().load('/texture/camera-monitor.png');
        cameraMonitorPositions.forEach((cameraMonitorPosition) => {
            const { begin, end } = cameraMonitorPosition;
            const { x, z } = this.getCenterOfModelArea(begin as ModelPointer, end as ModelPointer);
            const obj = new CameraMonitor(map, { x, y: this.scale(WALL_HEIGHT / 2), z });
            cameraMonitors.push(obj);
        });
        cameraMonitors.forEach((item) => this.odcGroup.add(item));
        globalEvent.dispatchEvent({ type: 'addClickObserver', message: cameraMonitors });
    }

    // TODO 材质优化
    private renderFloor() {
        this.odcGroup.add(
            new Floor(
                floor.begin.map((itm) => this.scale(itm)) as ModelPointer,
                floor.end.map((itm) => this.scale(itm)) as ModelPointer,
            ),
        );
    }

    private renderKeyPoints() {
        return keyPointPositions.map((item) => {
            const { begin, end } = item;
            const { x, z } = this.getCenterOfModelArea(begin as ModelPointer, end as ModelPointer);
            const keyPoint = new KeyPoint(20);
            keyPoint.position.z = z;
            keyPoint.position.y = this.scale(WALL_HEIGHT);
            keyPoint.position.x = x;
            keyPoint.userData.isNeedLiftCamera = item.type === 'hight';
            return keyPoint;
        });
    }

    private locationODC() {
        const box3 = new THREE.Box3();
        box3.expandByObject(this.odcGroup);
        const center = new THREE.Vector3();
        box3.getCenter(center);

        this.odcGroup.position.x = this.odcGroup.position.x - center.x;
        this.odcGroup.position.z = this.odcGroup.position.z - center.z;
    }

    private getCenterOfModelArea(begin: ModelPointer, end: ModelPointer) {
        const [beginX, beginY] = begin.map((element) => this.scale(element));
        const [endX, endY] = end.map((element) => this.scale(element));
        // 模型的 x 对应 坐标系 z 轴
        const centerZ = (beginX + endX) / 2;
        // 模型的 y 对应 坐标系 x 轴
        const centerX = (beginY + endY) / 2;
        return { x: centerX, z: centerZ };
    }
}
