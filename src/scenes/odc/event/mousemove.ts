import * as THREE from 'three';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';

import { clientX2X, clientY2Y } from '@/scenes/util/location';
import { getIntersectedMesh } from '@/scenes/util/raycaster';

export interface MousemoveObserver {
    onMousemove: (
        {
            highlightOutlinePass,
        }: {
            highlightOutlinePass: OutlinePass;
        },
        activeMesh: THREE.Mesh,
    ) => void;
    beforeMousemove: ({ highlightOutlinePass }: { highlightOutlinePass: OutlinePass }) => void;
    getMousemoveObserveObjects: () => THREE.Object3D[];
}

interface MousemoveObserverGroup {
    active: { activeMesh: THREE.Mesh; observer: MousemoveObserver }[];
    inactive: { observer: MousemoveObserver }[];
}

export class Mousemove {
    private observers: any[];
    private readonly camera: THREE.Camera;
    private readonly highlightOutlinePass: OutlinePass;
    private readonly moveRaycaster: THREE.Raycaster;

    public constructor({
        camera,
        highlightOutlinePass,
    }: {
        highlightOutlinePass: OutlinePass;
        camera: THREE.Camera;
    }) {
        // 被观测的实例
        this.observers = [];
        // 用于捕获光线
        this.camera = camera;
        this.moveRaycaster = new THREE.Raycaster();
        // 用于制作高亮
        this.highlightOutlinePass = highlightOutlinePass;
        this.initEvent();
    }

    public addObservers(observers: MousemoveObserver[]) {
        this.observers.push(...observers);
    }

    // TODO 合理抽象
    private getObserverGroup({ x, y }: { x: number; y: number }) {
        // 遍历每一个观测者 找到中奖选手
        return this.observers.reduce(
            (acc, observer) => {
                const activeMesh = getIntersectedMesh(
                    { camera: this.camera, raycasterInstance: this.moveRaycaster },
                    { x, y },
                    observer.getMousemoveObserveObjects(),
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
        document.addEventListener('mousemove', (event) => {
            const x = clientX2X(event.clientX);
            const y = clientY2Y(event.clientY);
            requestAnimationFrame(() => {
                // 移动执行前准备
                this.highlightOutlinePass.selectedObjects = [];
                // 遍历每一个观测者 找到中奖选手
                const observerGroup = this.getObserverGroup({ x, y }) as MousemoveObserverGroup;
                // 遍历未中奖选手 安慰 (优先这样处理是防止对中奖选手产生影响,有的为中奖选手会 移除 this.highlightOutlinePass.selectedObjects)
                observerGroup.inactive.forEach(({ observer }) => {
                    if (observer.beforeMousemove) {
                        observer.beforeMousemove({
                            highlightOutlinePass: this.highlightOutlinePass,
                        });
                    }
                });
                // 遍历中奖选手 发奖 暂时不考虑头奖选手 不让其他 mesh 得奖
                observerGroup.active.forEach(({ observer, activeMesh }) => {
                    if (observer.beforeMousemove) {
                        observer.beforeMousemove({
                            highlightOutlinePass: this.highlightOutlinePass,
                        });
                    }
                    if (observer.onMousemove) {
                        observer.onMousemove(
                            { highlightOutlinePass: this.highlightOutlinePass },
                            activeMesh,
                        );
                    }
                });
            });
        });
    }
}
