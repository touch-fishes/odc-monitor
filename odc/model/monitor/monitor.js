import * as THREE from '../../../build/three.module.js';
import { MTLLoader } from '../../../examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from '../../../examples/jsm/loaders/OBJLoader.js';

export class Monitor extends THREE.Group {

	static clazzName = 'monitor';

	static resource = {
		monitorObject3D: null
	}

	static loadResource() {
		return new Promise((resolve) => {
			new MTLLoader().load('./odc/model/monitor/monitor.mtl', (materials) => {
				const objLoader = new OBJLoader();
				objLoader.setMaterials(materials);
				objLoader.load('./odc/model/monitor/monitor.obj', (obj) => {
					this.resource.monitorObject3D = obj;
					return resolve({ monitorObject3D: obj })
				})
			});
		})

	}

	constructor() {
		super();
		this.monitor = this.createMonitor();
		this.userData.clazzName = Monitor.clazzName;
		// 用于备份高亮
		this.screenMaterial = this.monitor.getObjectByName('Screen').material;
		this.add(this.monitor);
	}

	createMonitor() {
		// TODO 现式错误
		const monitor = Monitor.resource.monitorObject3D.clone();
		return monitor;
	}

	active() {
		const loader = new THREE.TextureLoader();
		const screenTexture = loader.load( './odc/texture/screen.png');
		this.monitor.getObjectByName('Screen').material = new THREE.MeshPhongMaterial( { map: screenTexture});
	}

	silence() {
		this.monitor.getObjectByName('Screen').material = this.screenMaterial;
	}
}
