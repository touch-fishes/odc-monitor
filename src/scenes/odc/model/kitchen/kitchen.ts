import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

// TODO
export class Kitchen extends THREE.Group {
    public constructor() {
        super();
        this.initKitchen();
    }

    private initKitchen() {
        const objLoader = new OBJLoader();
        // TODO 修改为全局
        objLoader.load('/3d-model/kitchen/kitchen.obj', (obj) => {
            const scale = 0.8;
            obj.scale.set(scale, scale, scale);
            (obj.children[0] as THREE.Mesh).material.color.set(0xdeb887);
            this.add(obj);
        });
    }
}
