import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

import { Mousemove } from './event/mousemove';
import { Click } from './event/click';
import { globalEvent } from './event';
import { Floor } from './model/floor/floor';
import { GlassWall } from './model/wall/glass-wall';
import { Seat } from './model/seat/seat';
import { InnerWall } from './model/wall/inner-wall';
import { ExternalWall } from './model/wall/external-wall';
import { Workstation } from './model/workstation/workstation';
// import { Kitchen } from './model/kitchen/kitchen';
import { Monitor } from './model/monitor/monitor';
// import { Sofa } from './model/sofa/sofa';
// import { Robot } from './model/robot-expressive/robot';
import { KeyPoint } from './model/key-point/key-point';
import { floor, WALL_HEIGHT, WALL_THICKNESS, walls } from './data/buildings-data';
import {
    AreaSeats,
    northWorkstation,
    northWorkstationArea,
    SeatAreaType,
    southWorkstation,
    southWorkstationArea,
} from './data/workstations-data';
import { createHighlightElement } from './util/highlight';
import { arrowPositions } from './data/arrow';

import { ModelLine, ModelPointer } from '@/scenes/types';

// import { AppleHost } from './model/computer-host/apple-host';

export const loadODCResource = () => {
    return Promise.all([
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
    private readonly arrows: any[];

    public constructor() {
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
        // this.renderKitchen();

        // 渲染可爱的机器人
        // this.renderRobot();

        // this.renderNorthSofa();

        this.arrows = this.renderArrow();
        globalEvent.dispatchEvent({ type: 'addClickObserver', message: this.arrows });

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
        this.scene.add(new THREE.GridHelper(2000, 50));
    }
    private initLight() {
        const ambientLight = new THREE.AmbientLight(0x606060);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xFFFFFF);
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
        scene.background = new THREE.Color('#2b3a42');
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
        );
        theWorkstation.position.x = x;
        theWorkstation.position.z = z;
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

    // renderKitchen() {
    //     const { begin, end } = kitchenStation;
    //     const { x, z } = this.getCenterOfModelArea(begin, end);
    //     const kitchen = new Kitchen();
    //     kitchen.position.z = z;
    //     kitchen.position.x = x;
    //     this.odcGroup.add(kitchen);
    // }

    // renderNorthSofa() {
    //     const { begin, end } = northSofaStation;
    //     const { x, z } = this.getCenterOfModelArea(begin, end);
    //     const sofa = new Sofa(begin, end, { x, z });
    //     this.odcGroup.add(sofa);
    // }

    // todo
    // renderRobot() {
    //     const { begin, end } = robotStation;
    //     const { x, z } = this.getCenterOfModelArea(begin, end);
    //     const robot = new Robot();
    //     robot.position.z = z;
    //     robot.position.x = x;
    //     this.odcGroup.add(robot);
    // }

    // TODO 材质优化
    private renderFloor() {
        this.odcGroup.add(
            new Floor(
                floor.begin.map((itm) => this.scale(itm)) as ModelPointer,
                floor.end.map((itm) => this.scale(itm)) as ModelPointer,
            ),
        );
    }

    private renderArrow() {
        return arrowPositions.map((item) => {
            const { begin, end } = item;
            const { x, z } = this.getCenterOfModelArea(begin as ModelPointer, end as ModelPointer);
            const arrow = new KeyPoint(20);
            arrow.position.z = z;
            arrow.position.y = this.scale(WALL_HEIGHT);
            arrow.position.x = x;
            arrow.userData.isNeedLiftCamera = item.type === 'hight';
            return arrow;
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
