import * as THREE from 'three';

import { KeyPoint } from '@/scenes/odc/model/key-point/key-point';

export class CameraMonitor extends KeyPoint {
    public constructor(map: THREE.Texture, { x, y, z }: { x: number; y: number; z: number }) {
        super(0);
        this.position.z = z;
        this.position.x = x;
        this.position.y = y;
        this.add(this.initCameraMonitor(map));
    }

    protected initCameraMonitor(map: THREE.Texture) {
        const material = new THREE.SpriteMaterial({ map });
        const sprite = new THREE.Sprite(material);
        const scale = 20;
        sprite.scale.set(scale, scale, scale);
        sprite.userData.type = 'keypoint';
        return sprite;
    }
}
