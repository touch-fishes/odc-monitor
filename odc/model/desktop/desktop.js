import * as THREE from '../../../build/three.module.js';
import { OBJLoader } from '../../../examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from '../../../examples/jsm/loaders/MTLLoader.js';
import { HWHost } from '../computer-host/hw-host.js'
import { AppleHost } from '../computer-host/Apple-host.js'

export class Desktop {
	constructor(name, monitorNumber) {
		this.group = new THREE.Group();
		this.initMonitor(name, monitorNumber);
		this.initAppleHost(name);
		this.initHWHost(name);
		return this.group
	}
	initMonitor(name, number) {
		this.loaded = false;
		new MTLLoader().load('./model/monitor/monitor.mtl', (materials) => {
			const objLoader = new OBJLoader();
			objLoader.setMaterials(materials);
			objLoader.load('./model/monitor/monitor.obj', (obj) => {
				this.loaded = true;
				for (let i = 0; i < number; i++) {
					const monitorObj = obj.clone();
					monitorObj.rotation.y = - Math.PI
					monitorObj.position.z = (i * 40);
					monitorObj.name = `${name}_monitor_${number}`;
					monitorObj.userData.highlight = true;
					monitorObj.userData.type = 'monitor';
					this.group.add(monitorObj);
				}
			})
		});
	}
	initHWHost(name) {
		const hwHost = new HWHost({x:0, z:-8});
		hwHost.name = `${name}_pc`;
		hwHost.userData.highlight = true;
		hwHost.userData.type = 'pc';
		this.group.add(hwHost);
	}
	initAppleHost(name) {
		const macmini = new AppleHost({x:0, z:-16});
		macmini.name = `${name}_macmini`;
		macmini.userData.highlight = true;
		macmini.userData.type = 'macmini';
		this.group.add(macmini);
	}
}
