import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { Mousemove } from './event/mousemove';
import { Click } from './event/click';
import { globalEvent } from './event';
import { Seat } from './model/seat/seat';
import { Monitor } from './model/monitor/monitor';
import { AppleHost } from './model/computer-host/apple-host';
import { CoffeeTable } from './model/coffee-table/coffee-table';
import { Sofa } from './model/sofa/sofa';
import { Kitchen } from './model/kitchen/kitchen';
import { Structure } from './structure';

import { createHighlightElement } from '@/scenes/util/highlight';
import { animateOrbitCamera } from '@/scenes/util/camera';
import { getObject3DChild, getObject3DChildren } from '@/scenes/util/object-3d';
import { Helper } from '@/scenes/odc/helper';

const isNeedHelp = () => {
    return location.search.includes('help=1');
};

export const loadODCResource = (onLoad: () => void) => {
    const loadingManager = new THREE.LoadingManager(onLoad);
    return Promise.all([
        CoffeeTable.loadResource(loadingManager),
        Sofa.loadResource(loadingManager),
        Kitchen.loadResource(loadingManager),
        Monitor.loadResource(loadingManager),
        AppleHost.loadResource(),
        Seat.loadResource(loadingManager),
    ]);
};

export class ODC {
    private readonly renderer: THREE.WebGLRenderer;
    private readonly camera: THREE.PerspectiveCamera;
    private readonly oldCamera: THREE.PerspectiveCamera;
    private readonly scene: THREE.Scene;
    private readonly highlightComposer: EffectComposer;
    private readonly highlightOutlinePass: OutlinePass;
    private readonly controls: OrbitControls;
    private readonly structure: Structure;
    private readonly baseMonitorTarget: THREE.Vector3;
    private readonly helper: Helper | undefined;

    public constructor() {
        this.renderer = this.initRender();

        this.camera = this.initCamera();

        this.oldCamera = this.initCamera();

        this.scene = this.initScene();

        this.controls = this.initControls();

        this.baseMonitorTarget = this.controls.target.copy(new THREE.Vector3());

        // 正式情况无需展示
        if (isNeedHelp()) {
            this.helper = new Helper();
            this.scene.add(this.helper);
        }

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

        this.structure = new Structure();

        this.scene.add(this.structure);

        this.locationODC();

        this.animate();
    }

    public getStructure() {
        return this.structure;
    }

    public getCamera() {
        return this.camera;
    }
    public getControls() {
        return this.controls;
    }

    public refresh() {
        animateOrbitCamera(
            { camera: this.camera, controls: this.controls },
            {
                cameraPosition: this.camera.position,
                orbitTargetPosition: this.controls.target,
            },
            {
                cameraPosition: this.oldCamera.position,
                orbitTargetPosition: this.baseMonitorTarget,
            },
        );
    }

    public lightSeat(seats: string[]) {
        const allSeats = getObject3DChildren(this.structure, Seat.clazzName);
        allSeats.forEach((seat) => {
            (seat as Seat).lightOff();
        });
        seats.forEach((seatCode) => {
            const seat = getObject3DChild(this.structure, Seat.clazzName, seatCode) as Seat;
            seat?.keyPoint?.observationArea(
                { camera: this.camera, controls: this.controls },
                seat.keyPoint.children[0] as THREE.Mesh,
            );
            if (seat) (seat as Seat).lightOn();
        });
    }

    private initEvent() {
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

    private initControls() {
        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.maxDistance = 1800;
        controls.screenSpacePanning = false;
        controls.maxPolarAngle = Math.PI / 2.06;
        return controls;
    }

    private initLight() {
        // 环境光源
        const ambientLight = new THREE.AmbientLight(0x606060, 2);
        this.scene.add(ambientLight);

        // const directionalLight = new THREE.DirectionalLight(0xffffff);
        // directionalLight.position.set(1, 0.75, 0.5).normalize();
        // this.scene.add(directionalLight);
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
        return new THREE.Scene();
    }

    private initRender() {
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setClearAlpha(0.2);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.append(renderer.domElement);
        return renderer;
    }

    private animate() {
        requestAnimationFrame(this.animate.bind(this));
        TWEEN.update();
        this.highlightComposer.render();
        if (isNeedHelp()) {
            this.helper?.stats.update();
        }
    }

    private locationODC() {
        const box3 = new THREE.Box3();
        box3.expandByObject(this.structure);
        const center = new THREE.Vector3();
        box3.getCenter(center);
        this.structure.position.x = this.structure.position.x - center.x;
        this.structure.position.z = this.structure.position.z - center.z;
    }
}
