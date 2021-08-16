import * as THREE from '../../../build/three.module.js';
import {OBJLoader} from "../../../examples/jsm/loaders/OBJLoader.js";
import {Desktop} from "../desktop/desktop.js";
import {Arrow} from "../arrow/arrow.js";
import {getSize} from "../../util/object3D.js";

export class Seat extends THREE.Group {
	constructor({ tableObject3D }, seatInfo) {
		const theSeatInfo = seatInfo || {};
		super();
		this.table = null;
		this.keyPoint = null;
		this.desktop = null;
		// 桌子为外部模型
		this.table = this.createTable(tableObject3D);
		this.keyPoint = this.createKeyPoint();
		this.desktop = this.createDeskTop(theSeatInfo);
		this.add(this.table);
		this.add(this.keyPoint);
		this.add(this.desktop);

	}
	static loadResource() {
		return new Promise((resolve) => {
			const objLoader = new OBJLoader();
			objLoader.load('./odc/model/workstation/table.obj', (obj) => {
				resolve({ tableObject3D: obj });
			})
		})
	}
	createKeyPoint() {
		const keyPoint = new Arrow(20);
		const { x: tableX } = getSize(this.table);
		keyPoint.position.y = 10
		keyPoint.position.x = -tableX - 6;
		return keyPoint;
	}
	createDeskTop(seatInfo) {
		const desktopName = `desktop_${seatInfo.rowCode}`;
		const desktop = new Desktop(desktopName, seatInfo);
		desktop.name = desktopName;
		desktop.scale.set(0.25, 0.25, 0.25);
		const { z: tableZ, y: tableY } = getSize(this.table);
		desktop.position.y = tableY;
		desktop.position.z = this.table.position.z - tableZ/4;
		return desktop;
	}
	createTable(tableObject3D) {
		const table = tableObject3D.clone();
		// 单张桌子长度
		const { x, z } = getSize(table);
		// 能放桌子的区域 比 目前桌子长
		// TODO scale 计算错误
		// const scale = (zLength / seats.length - 1) / x;
		const scale = 0.25;
		table.rotation.x = -Math.PI / 2;
		table.rotation.z = Math.PI / 2;
		table.scale.set(scale, scale, scale);
		return table;
	}
}
