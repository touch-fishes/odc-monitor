import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';

import { animateOrbitCamera } from '../../util/camera';

import { ClickObserver } from '@/scenes/odc/event/click';

export class KeyPoint extends THREE.Group implements ClickObserver {
    public static clazzName = 'keyPoint';

    private looAtPosition: THREE.Vector3;
    private readonly keyPoint: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;

    public constructor(size: number) {
        super();
        this.looAtPosition = new THREE.Vector3(0, 0, 0);
        this.keyPoint = new THREE.Mesh(this.createGeometry(size), this.createMaterial());
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

    public getClickObserveObjects() {
        return this.children;
    }

    public setLookAt(lookAt: THREE.Vector3) {
        this.looAtPosition = lookAt;
    }

    private createMaterial() {
        const loader = new THREE.TextureLoader();
        const texture = loader.load('/texture/key-point.png');
        return new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide,
        });
    }

    private createGeometry(size: number) {
        const geometry = new THREE.PlaneGeometry(size, size);
        geometry.rotateX(Math.PI / 2);
        return geometry;
    }

    private observationArea(
        { camera, controls }: { camera: THREE.Camera; controls: OrbitControls },
        activeMesh: THREE.Mesh,
    ) {
        const { x, y, z } = activeMesh.getWorldPosition(new THREE.Vector3());
        const basePosition = new THREE.Vector3(x, y, z);
        animateOrbitCamera(
            { camera, controls },
            { cameraPosition: camera.position, orbitTargetPosition: controls.target },
            { cameraPosition: basePosition, orbitTargetPosition: this.looAtPosition },
        );
    }
}
