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
    }

    public getClickObserveObjects() {
        return this.children;
    }

    protected initCameraMonitor(map: THREE.Texture) {
        const material = new THREE.SpriteMaterial({ map });
        const sprite = new THREE.Sprite(material);
        const scale = 20;
        sprite.scale.set(scale, scale, scale);
        sprite.userData.type = 'cameraMonitor';
        return sprite;
    }

    private observationArea({
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
}
