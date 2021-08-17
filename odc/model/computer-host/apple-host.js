import * as THREE from '../../../build/three.module.js';
import { Host } from './host.js'
import { OBJLoader } from '../../../examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from '../../../examples/jsm/loaders/MTLLoader.js';

export class AppleHost extends Host{

	static clazzName = 'AppleHost';

	constructor() {
		super();
		this.userData.clazzName = AppleHost.clazzName;
		this.createLogo().then((logo) => {
			this.logo = logo;
			this.add(this.logo);
		});
	}

	createHostMaterial() {
		return new THREE.MeshLambertMaterial( {} );
	}

	createLogo() {
		// TODO 修改为依赖注入模式
		return new Promise((resolve) => {
			new MTLLoader().load('./odc/model/computer-host/apple-logo/apple-logo.mtl', (materials) => {
				const objLoader = new OBJLoader();
				objLoader.setMaterials(materials);
				objLoader.load('./odc/model/computer-host/apple-logo/apple-logo.obj', (obj) => {
					obj.position.x = this.host.position.x - (this.baseWidth/2);
					obj.position.z = this.host.position.z;
					obj.position.y = this.baseHeight / 8;
					obj.rotation.y = - Math.PI/2;
					obj.scale.set(0.04,0.04,0.04);
					resolve(obj);
				})
			})
		});
	}
}
