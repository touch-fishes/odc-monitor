import * as THREE from 'three';
import { Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';

import { ClickObserver } from '@/scenes/odc/event/click';
import { animateOrbitCamera } from '@/scenes/util/camera';
import { SeatAreaType } from '@/data/workstations-data';

export class CameraMonitor extends THREE.Group implements ClickObserver {
    private readonly areaType: string;
    private observedSeatRowIndex: number;

    public constructor(
        map: THREE.Texture,
        { x, y, z }: { x: number; y: number; z: number },
        { areaType, observedSeatRowIndex }: { areaType: string; observedSeatRowIndex: number },
    ) {
        super();
        this.position.z = z;
        this.position.x = x;
        this.position.y = y;
        this.areaType = areaType;
        this.observedSeatRowIndex = observedSeatRowIndex;
        this.add(this.initCameraMonitor(map));
        this.add(this.initLine());
    }

    public beforeClick() {}

    public onClick(
        {
            highlightOutlinePass,
            camera,
            controls,
        }: {
            highlightOutlinePass: OutlinePass;
            controls: OrbitControls;
            camera: THREE.Camera;
        },
        activeMesh: THREE.Mesh,
    ) {
        if (activeMesh.userData.type === 'cameraMonitor') {
            this.observationArea({ camera, controls });
        }
        return false;
    }

    public getClickObserveObjects() {
        return this.children;
    }

    public observationArea({
        camera,
        controls,
    }: {
        camera: THREE.Camera;
        controls: OrbitControls;
    }) {
        const { x, y, z } = this.getWorldPosition(new Vector3());
        const basePosition =
            this.areaType === SeatAreaType.north
                ? new THREE.Vector3(x - 10, y + 120, z + 60)
                : new THREE.Vector3(x, y + 80, z - 80);
        // @ts-ignore
        const target: THREE.Group = this.parent.children.find((item) =>
            item.name.includes(this.areaType),
        );
        const position = target.children[0].children[this.observedSeatRowIndex].getWorldPosition(
            new Vector3(),
        );
        const lookAtPosition = new Vector3(position.x, position.y, position.z + 100);
        animateOrbitCamera(
            { camera, controls },
            { cameraPosition: camera.position, orbitTargetPosition: controls.target },
            { cameraPosition: basePosition, orbitTargetPosition: lookAtPosition },
        );
    }

    public setColor(hex: number) {
        (this.children[0] as THREE.Sprite).material.color.set(hex);
    }

    public setScale(scale: number) {
        (this.children[0] as THREE.Sprite).scale.set(scale, scale, scale);
    }

    protected initCameraMonitor(map: THREE.Texture) {
        const material = new THREE.SpriteMaterial({ map, sizeAttenuation: false });
        const sprite = new THREE.Sprite(material);
        const scale = .05;
        sprite.scale.set(scale, scale, scale);
        sprite.userData.type = 'cameraMonitor';
        return sprite;
    }

    protected initLine() {
        const points = [new THREE.Vector3(0, -80, 0), new THREE.Vector3(0, 0, 0)];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        geometry.setAttribute(
            'color',
            new THREE.Float32BufferAttribute(
                [
                    new THREE.Color(0x000000).r,
                    new THREE.Color(0x000000).g,
                    new THREE.Color(0x000000).b,
                    new THREE.Color(0xffffff).r,
                    new THREE.Color(0xffffff).g,
                    new THREE.Color(0xffffff).b,
                ],
                3,
            ),
        );
        const material = new THREE.LineBasicMaterial({ vertexColors: true });
        return new THREE.Line(geometry, material);
    }
}
