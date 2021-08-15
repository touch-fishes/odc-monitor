import * as THREE from '../../../build/three.module.js';
import { Host } from './host.js'
import { OBJLoader } from '../../../examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from '../../../examples/jsm/loaders/MTLLoader.js';

export class AppleHost extends Host{

	constructor() {
		return super();
	}

	initMaterial() {
		return new THREE.MeshLambertMaterial( {} );
	}

	renderLog() {
		new MTLLoader().load('./odc/model/computer-host/apple-logo/apple-logo.mtl', (materials) => {
			const objLoader = new OBJLoader();
			objLoader.setMaterials(materials);
			objLoader.load('./odc/model/computer-host/apple-logo/apple-logo.obj', (obj) => {
				obj.position.x = this.host.position.x - (this.baseWidth/2);
				obj.position.z = this.host.position.z;
				obj.position.y = this.baseHeight / 8;
				obj.rotation.y = - Math.PI/2;
				obj.scale.set(0.04,0.04,0.04);
				this.group.add(obj);
			})
		})
	}
}
