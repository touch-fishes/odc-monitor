import * as THREE from '../../../build/three.module.js';
import { Host } from './host.js'
import { OBJLoader } from '../../../examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from '../../../examples/jsm/loaders/MTLLoader.js';

export class AppleHost extends Host{

	constructor({x, z}) {
		return super({x, z});
	}

	initMaterial() {
		return new THREE.MeshLambertMaterial( { color: '0xffffff', metalness: {
				roughness: 1.0,
				metalness: 0.6,
			}} );
	}

	renderLog({x, z}) {
		new MTLLoader().load('./model/computer-host/apple-logo/apple-logo.mtl', (materials) => {
			const objLoader = new OBJLoader();
			objLoader.setMaterials(materials);
			objLoader.load('./model/computer-host/apple-logo/apple-logo.obj', (obj) => {
				obj.position.x = x - (this.baseWidth/2);
				obj.position.z = z;
				obj.position.y = this.baseHeight / 8;
				obj.rotation.y = - Math.PI/2;
				obj.scale.set(0.04,0.04,0.04);
				this.group.add(obj);
			})
		})
	}
}
