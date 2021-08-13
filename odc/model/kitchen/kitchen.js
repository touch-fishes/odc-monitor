import * as THREE from '../../../build/three.module.js';
import { OBJLoader } from '../../../examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from '../../../examples/jsm/loaders/MTLLoader.js';

export class Kitchen {

    constructor() {
        this.group = new THREE.Group();
        this.initKitchen();
        return this.group
    }

    initKitchen() {
        const objLoader = new OBJLoader();
        objLoader.load('./odc/model/kitchen/kitchen.obj', (obj) => {
            const scale = 0.8;
            obj.scale.set(scale, scale, scale);
            obj.children[0].material.color.set(0xDEB887);
            this.group.add(obj);
        })
    }
}
