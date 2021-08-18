import * as THREE from '../../../build/three.module.js';
import { OBJLoader } from '../../../examples/jsm/loaders/OBJLoader.js';

export class Kitchen extends THREE.Group{

    constructor({kitchenObj3D}) {
    	super();
    	this.add(kitchenObj3D)
    }

    static loadKitchenResource() {
    	return new Promise((resolve) => {
			const objLoader = new OBJLoader();
			objLoader.load('./odc/model/kitchen/kitchen.obj', (obj) => {
				const scale = 0.8;
				obj.scale.set(scale, scale, scale);
				obj.children[0].material.color.set(0xDEB887);
				resolve({kitchenObj3D: obj})
			})
		})
	}
}
