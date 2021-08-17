import * as THREE from '../../../build/three.module.js';
import { HWHost } from '../computer-host/hw-host.js'
import { AppleHost } from '../computer-host/Apple-host.js'
import { generateTextSprite } from '../../util/generate-text-sprite.js';
import { getDefinedObject3D, getSize, setEqualScale } from '../../util/object3D.js';
import { Monitor } from "../monitor/monitor.js";

export class Desktop extends THREE.Group{

	static clazzName = 'desktop';

	constructor(name, seatInfo) {
		super();
		this.monitors = [];
		this.monitorTips = [];
		this.pc = null;
		this.pcTip = null;
		this.macMini = null;
		this.macMiniTip = null;
		// 稳定性标识用于识别 当前 Group
		this.userData.clazzName = Desktop.clazzName;
		const { monitors, monitorTips } = this.createMonitor(name, seatInfo);
		this.monitors.push(...monitors);
		this.monitorTips.push(...monitorTips);
		const { macMini, macMiniTip } = this.createMacMini(name, seatInfo);
		const { pc, pcTip } = this.createPC(name, seatInfo);
		this.pc = pc;
		this.pcTip = pcTip;
		this.macMini = macMini;
		this.macMiniTip = macMiniTip;
		this.add(this.pc);
		this.add(this.pcTip);
		this.add(this.macMini);
		this.add(this.macMiniTip);
		this.monitors.forEach((monitor) => this.add(monitor));
		this.monitorTips.forEach((monitorTip) => this.add(monitorTip));
	}
	createMonitor(name, seatInfo) {
		this.loaded = false;
		const monitors = [];
		const monitorTips = [];
		const theMonitorObj = new Monitor();
		this.moitorSize = getSize(theMonitorObj);
		if (!Array.isArray(seatInfo.monitor)) return { monitors: [], monitorTips: [] };
		for (let i = 0; i < seatInfo.monitor.length; i++) {
			const monitorObj = theMonitorObj.clone();
			monitorObj.rotation.y = - Math.PI
			monitorObj.position.z = (i * 40);
			monitorObj.name = `${name}_monitor_${i}`;
			monitorObj.userData.highlight = true;
			monitorObj.userData.type = `monitor.${i}`;
			monitorObj.userData.data = seatInfo;
			const monitorTip = this.createTextSprite(seatInfo.monitor[i]);
			const { y, z } = getSize(monitorObj);
			monitorTip.position.y = y + 3;
			monitorTip.position.z = monitorObj.position.z + z/2;
			monitorTip.material.visible = false;
			monitors.push(monitorObj);
			monitorTips.push(monitorTip);
		}
		return { monitors, monitorTips };
	}
	createPC(name, info) {
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
		hwTip.material.visible = false;
		return {
			pc: hwHost,
			pcTip: hwTip
		}
	}
	createMacMini(name, info) {
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
		return {
			macMini: macmini,
			macMiniTip: macminiTip
		}
	}
	createTextSprite(text) {
		const textSprite = generateTextSprite(text || '', {
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
	/**
	 * 激活
	 * @param activeMesh
	 * @returns {Promise<void>}
	 */
	async active(activeMesh) {
		const member = getDefinedObject3D(activeMesh);
		const clazzName = member.userData.clazzName;
		if (clazzName === Monitor.clazzName) {
			// 有两个屏幕不好定位
			member.active();
		}
		if (clazzName === AppleHost.clazzName) {
			this.macMiniTip.material.visible = true;
			this.macMini.active();
		}
		if (clazzName === HWHost.clazzName) {
			this.pcTip.material.visible = true;
			this.pc.active();
		}
	}

	/**
	 * 沉默接触所有的激活效果
	 */
	silence() {
		this.pc.silence();
		this.macMini.silence();
		this.monitors.forEach((monitor) => {
			monitor.silence();
		});
		this.pcTip.material.visible = false;
		this.macMiniTip.material.visible = false;
		this.monitorTips.forEach((object3D) => {
			object3D.material.visible = false;
		})
	}
}
