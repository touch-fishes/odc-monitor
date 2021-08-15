import * as THREE from '../../../build/three.module.js';
import { OBJLoader } from '../../../examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from '../../../examples/jsm/loaders/MTLLoader.js';
import { HWHost } from '../computer-host/hw-host.js'
import { AppleHost } from '../computer-host/Apple-host.js'
import { generateTextSprite } from '../../util/generate-text-sprite.js';
import { getSize, setEqualScale } from '../../util/object3D.js';

export class Desktop {
	constructor(name, seatInfo) {
		this.group = new THREE.Group();
		this.tips = [];
		this.initMonitor(name, seatInfo).then(() => {
			this.initAppleHost(name, seatInfo);
			this.initHWHost(name, seatInfo);
		});
		return this.group
	}
	initMonitor(name, seatInfo) {
		this.loaded = false;
		return new Promise((resolve) => {
			new MTLLoader().load('./odc/model/monitor/monitor.mtl', (materials) => {
				const objLoader = new OBJLoader();
				objLoader.setMaterials(materials);
				objLoader.load('./odc/model/monitor/monitor.obj', (obj) => {
					this.loaded = true;
					for (let i = 0; i < seatInfo.monitor.length; i++) {
						const monitorObj = obj.clone();
						this.moitorSize = getSize(monitorObj);
						monitorObj.rotation.y = - Math.PI
						monitorObj.position.z = (i * 40);
						monitorObj.name = `${name}_monitor_${i}`;
						monitorObj.userData.highlight = true;
						monitorObj.userData.type = `monitor.${i}`;
						monitorObj.userData.data = seatInfo;
						monitorObj.userData.materials = monitorObj.getObjectByName('Screen').material;
						const monitorTip = this.createTextSprite(seatInfo.monitor[i]);
						const { y, z } = getSize(monitorObj);
						monitorTip.position.y = y + 3;
						monitorTip.position.z = monitorObj.position.z + z/2;
						monitorTip.material.visible =false;
						this.tips.push(monitorTip);
						this.group.add(monitorTip);
						this.group.add(monitorObj);
					}
					resolve()
				})
			});
		})
	}
	initHWHost(name, info) {
		const hwHost = new HWHost();
		const { y, z } = getSize(hwHost);
		hwHost.position.z = (-z - 1);
		hwHost.position.y = y/2;
		hwHost.name = `${name}_pc`;
		hwHost.userData.highlight = true;
		hwHost.userData.type = 'pc';
		hwHost.userData.data = info;
		hwHost.userData.materials = hwHost.children[0].material;
		const hwTip = this.createTextSprite(info.pc);
		hwTip.position.y = y + 3;
		hwTip.position.z = hwHost.position.z;
		hwTip.material.visible =false;
		this.tips.push(hwTip);
		this.group.add(hwTip);
		this.group.add(hwHost);
	}
	initAppleHost(name, info) {
		const macmini = new AppleHost();
		const { y } = getSize(macmini);
		// macmini 放在显示器右边
		macmini.position.z = this.moitorSize.z * 2 + 1;
		macmini.position.y = y/2;
		macmini.name = `${name}_macmini`;
		macmini.userData.highlight = true;
		macmini.userData.type = 'macmini';
		macmini.userData.data = info;
		macmini.userData.materials = macmini.children[0].material;
		const macminiTip = this.createTextSprite(info.macmini);
		const { x: tipX } = getSize(macminiTip);
		macminiTip.position.y = y + 3;
		macminiTip.position.z = macmini.position.z + (tipX/3);
		macminiTip.material.visible = false;
		this.tips.push(macminiTip);
		this.group.add(macminiTip);
		this.group.add(macmini);
	}
	createTextSprite(text) {
		const textSprite = generateTextSprite(text, {
			fontFace: 'Helvetica',
			fontSize: 36,
			fontColor: 'rgba(255, 255, 255, 1)',
			fontBold: false,
			fontItalic: false,
			textAlign: 'center',
			borderThickness: 3,
			borderColor: 'rgba(50, 50, 255, 0.8)',
			borderRadius: 6,
			backgroundColor: 'rgba(0, 0, 0, 0.8)'
		});
		setEqualScale(textSprite, 0.1);
		return textSprite;
	}
	showTip() {
		this.tips.forEach((object3D) => {
			object3D.material.visible = true;
		})
	}
	hideTip() {
		this.tips.forEach((object3D) => {
			object3D.material.visible = false;
		})
	}
}
