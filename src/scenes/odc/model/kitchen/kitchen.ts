import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

import { p } from '@/scenes/odc/util/path';

// TODO
export class Kitchen extends THREE.Group {
    private static resource: Record<string, undefined | THREE.Object3D> = {
        kitchenObject3D: undefined,
    };

    public static loadResource(loadingManager: THREE.LoadingManager) {
        return new Promise((resolve) => {
            const objLoader = new OBJLoader(loadingManager);
            objLoader.load(p('/3d-model/kitchen/kitchen.obj'), (obj) => {
                Kitchen.resource.kitchenObject3D = obj;
                resolve({ kitchenObject3D: obj });
            });
        });
    }
    private readonly kitchen: THREE.Object3D;

    public constructor() {
        super();
        this.kitchen = this.createKitchen();
        this.add(this.kitchen);
    }

    private createKitchen() {
        if (!Kitchen.resource.kitchenObject3D) throw new Error('No Resource');
        const obj = Kitchen.resource.kitchenObject3D.clone();
        const scale = 0.8;
        obj.scale.set(scale, scale, scale);
        ((obj.children[0] as THREE.Mesh).material as THREE.MeshPhongMaterial).color.set(0xdeb887);
        return obj;
    }
}
