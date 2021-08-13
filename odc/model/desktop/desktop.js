import * as THREE from '../../../build/three.module.js';
import { OBJLoader } from '../../../examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from '../../../examples/jsm/loaders/MTLLoader.js';
import { HWHost } from '../computer-host/hw-host.js'
import { AppleHost } from '../computer-host/Apple-host.js'

export class Desktop {
	constructor(name, seatInfo) {
		this.group = new THREE.Group();
		this.initMonitor(name, seatInfo);
		this.initAppleHost(name, seatInfo);
		this.initHWHost(name, seatInfo);
		return this.group
	}
	initMonitor(name, seatInfo) {
		this.loaded = false;
		new MTLLoader().load('./odc/model/monitor/monitor.mtl', (materials) => {
			const objLoader = new OBJLoader();
			objLoader.setMaterials(materials);
			objLoader.load('./odc/model/monitor/monitor.obj', (obj) => {
				this.loaded = true;
				for (let i = 0; i < seatInfo.monitor.length; i++) {
					const monitorObj = obj.clone();
					monitorObj.rotation.y = - Math.PI
					monitorObj.position.z = (i * 40);
					monitorObj.name = `${name}_monitor_${i}`;
					monitorObj.userData.highlight = true;
					monitorObj.userData.type = `monitor.${i}`;
					monitorObj.userData.data = seatInfo;
					monitorObj.userData.materials = monitorObj.getObjectByName('Screen').material;
					this.group.add(monitorObj);
				}
			})
		});
	}
	initHWHost(name, info) {
		const hwHost = new HWHost({x:0, z:-8});
		hwHost.name = `${name}_pc`;
		hwHost.userData.highlight = true;
		hwHost.userData.type = 'pc';
		hwHost.userData.data = info;
		hwHost.userData.materials = hwHost.children[0].material;
		this.group.add(hwHost);
	}
	initAppleHost(name, info) {
		const macmini = new AppleHost({x:0, z:-16});
		macmini.name = `${name}_macmini`;
		macmini.userData.highlight = true;
		macmini.userData.type = 'macmini';
		macmini.userData.data = info;
		macmini.userData.materials = macmini.children[0].material;
		this.group.add(macmini);
	}
}
