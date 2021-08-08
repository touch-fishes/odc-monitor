import * as THREE from '../../../build/three.module.js';
import { OBJLoader } from '../../../examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from '../../../examples/jsm/loaders/MTLLoader.js';
import { HWHost } from '../computer-host/hw-host.js'
import { AppleHost } from '../computer-host/Apple-host.js'

export class Desktop {
	constructor(monitorNumber) {
		this.group = new THREE.Group();
		this.initMonitor(monitorNumber);
		this.initAppleHost();
		this.initHWHost();
		return this.group
	}
	initMonitor(number) {
		for (let i = 0; i < number; i++) {
			new MTLLoader().load('./model/monitor/monitor.mtl', (materials) => {
				const objLoader = new OBJLoader();
				objLoader.setMaterials(materials);
				objLoader.load('./model/monitor/monitor.obj', (obj) => {
					obj.rotation.y = - Math.PI
					obj.position.z = (i * 40) ;
					this.group.add(obj);
				})
			})
		}
	}
	initHWHost() {
		this.group.add(new HWHost({x:0, z:-8}));
	}
	initAppleHost() {
		this.group.add(new AppleHost({x:0, z:-16}));
	}
}
