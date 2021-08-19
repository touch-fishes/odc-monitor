import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

import { KitchenObj3D } from '@/scenes/types';

// TODO
export class Kitchen extends THREE.Group {
    public static loadKitchenResource(): Promise<KitchenObj3D> {
        return new Promise((resolve) => {
            const objLoader = new OBJLoader();
            objLoader.load('/3d-model/kitchen/kitchen.obj', (obj) => {
                const scale = 0.8;
                obj.scale.set(scale, scale, scale);
                ((obj.children[0] as THREE.Mesh).material as THREE.MeshPhongMaterial).color.set(
                    0xDEB887,
                );
                resolve({ kitchenObj3D: obj });
            });
        });
    }
    public constructor({ kitchenObj3D }: KitchenObj3D) {
        super();
        this.add(kitchenObj3D);
    }
}
