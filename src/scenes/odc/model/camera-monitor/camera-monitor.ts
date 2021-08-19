import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

import { CameraMonitorObj3D } from '@/scenes/types';

export class CameraMonitor extends THREE.Group {

    // TODO 抽象
    public static loadCameraMonitorResource(): Promise<CameraMonitorObj3D> {
        return new Promise((resolve) => {
            const objLoader = new OBJLoader();
            objLoader.load('/3d-model/camera-monitor/camera-monitor.obj', (obj) => {
                const scale = 0.5;
                obj.scale.set(scale, scale, scale);
                obj.rotation.x = -Math.PI;
                resolve({ cameraMonitorObj3D: obj });
            });
        });
    }

    public constructor(
        { cameraMonitorObj3D }: CameraMonitorObj3D,
        { x, y, z }: { x: number; y: number; z: number },
    ) {
        super();
        this.position.z = z;
        this.position.x = x;
        this.position.y = y;
        const temp = cameraMonitorObj3D.clone();
        this.add(temp);
    }
}
