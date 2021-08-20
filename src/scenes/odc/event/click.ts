import * as THREE from 'three';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { clientX2X, clientY2Y } from '@/scenes/util/location';
import { getIntersectedMesh } from '@/scenes/util/raycaster';

export interface ClickObserver {
    onClick: (
        {
            highlightOutlinePass,
            controls,
            camera,
        }: {
            highlightOutlinePass: OutlinePass;
            controls: OrbitControls;
            camera: THREE.Camera;
        },
        activeMesh: THREE.Mesh,
    ) => void;
    beforeClick: () => void;
    getClickObserveObjects: () => THREE.Object3D[];
}
interface ClickObserverGroup {
    active: { activeMesh: THREE.Mesh; observer: ClickObserver }[];
    inactive: { observer: ClickObserver }[];
}

export class Click {
    // TODO type
    private observers: any[];
    private readonly camera: THREE.Camera;
    private readonly controls: OrbitControls;
    private readonly highlightOutlinePass: OutlinePass;
    private readonly clickRaycaster: THREE.Raycaster;

    public constructor({
        camera,
        highlightOutlinePass,
        controls,
    }: {
        highlightOutlinePass: OutlinePass;
        controls: OrbitControls;
        camera: THREE.Camera;
    }) {
        // 被观测的实例
        this.observers = [];
        // 用于捕获光线
        this.camera = camera;
        this.controls = controls;
        this.clickRaycaster = new THREE.Raycaster();
        // 用于制作高亮
        this.highlightOutlinePass = highlightOutlinePass;
        this.initEvent();
    }

    public addObservers(observers: ClickObserver[]) {
        this.observers.push(...observers);
    }

    // TODO 合理抽象
    private getObserverGroup({ x, y }: { x: number; y: number }) {
        // 遍历每一个观测者 找到中奖选手
        return this.observers.reduce(
            (acc, observer) => {
                const activeMesh = getIntersectedMesh(
                    { camera: this.camera, raycasterInstance: this.clickRaycaster },
                    { x, y },
                    observer.getClickObserveObjects(),
                );
                return activeMesh
                    ? {
                          active: [...acc.active, { activeMesh, observer }],
                          inactive: acc.inactive,
                      }
                    : {
                          active: acc.active,
                          inactive: [...acc.inactive, { observer }],
                      };
            },
            { active: [], inactive: [] },
        );
    }

    private initEvent() {
        document.addEventListener('click', (event) => {
            const x = clientX2X(event.clientX);
            const y = clientY2Y(event.clientY);
            // TODO 类型
            // 遍历每一个观测者 找到中奖选手
            const observerGroup = this.getObserverGroup({ x, y }) as unknown as ClickObserverGroup;
            observerGroup.inactive.forEach(({ observer }) => {
                if (observer.beforeClick) observer.beforeClick();
            });
            // 遍历中奖选手 发奖 暂时不考虑头奖选手 不让其他 mesh 得奖
            observerGroup.active.forEach(({ observer, activeMesh }) => {
                if (observer.beforeClick) observer.beforeClick();
                if (observer.onClick) {
                    observer.onClick(
                        {
                            highlightOutlinePass: this.highlightOutlinePass,
                            controls: this.controls,
                            camera: this.camera,
                        },
                        activeMesh,
                    );
                }
            });
        });
    }
}
