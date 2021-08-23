import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { Sprite } from 'three';

import { animateOrbitCamera } from '@/scenes/util/camera';
import { ClickObserver } from '@/scenes/odc/event/click';
import { p } from '@/scenes/util/path';

export class KeyPoint extends THREE.Group implements ClickObserver {
    public static clazzName = 'keyPoint';

    private looAtPosition: THREE.Vector3;
    private readonly keyPoint: Sprite;

    public constructor(size: number) {
        super();
        this.looAtPosition = new THREE.Vector3(0, 0, 0);
        this.keyPoint = this.createKeypoint();
        this.keyPoint.userData.type = 'keypoint';
        this.userData.clazzName = KeyPoint.clazzName;
        this.add(this.keyPoint);
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
        if (activeMesh.userData.type === 'keypoint') {
            this.observationArea({ camera, controls }, activeMesh);
        }
    }

    public observationArea(
        { camera, controls }: { camera: THREE.Camera; controls: OrbitControls },
        activeMesh: THREE.Mesh,
    ) {
        const { x, y, z } = activeMesh.getWorldPosition(new THREE.Vector3());
        const basePosition = activeMesh.parent?.userData.isSideKeypoint
            ? new THREE.Vector3(x, y + 800, z - 100)
            : new THREE.Vector3(x, y, z);
        animateOrbitCamera(
            { camera, controls },
            { cameraPosition: camera.position, orbitTargetPosition: controls.target },
            { cameraPosition: basePosition, orbitTargetPosition: this.looAtPosition },
        );
    }

    public getClickObserveObjects() {
        return this.children;
    }

    public setLookAt(lookAt: THREE.Vector3) {
        this.looAtPosition = lookAt;
    }

    private createKeypoint() {
        const loader = new THREE.TextureLoader();
        const texture = loader.load(p('/texture/key-point.png'));
        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);
        const scale = 20;
        sprite.scale.set(scale, scale, scale);
        return sprite;
    }
}
