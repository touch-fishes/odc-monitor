import * as THREE from '../../../build/three.module.js';
import { OBJLoader } from '../../../examples/jsm/loaders/OBJLoader.js';

export class Workstation {
	constructor({xLength, zLength}, seats) {
		this.group = new THREE.Group();
		this.initSeats({xLength, zLength}, seats);
		// this.initFloor(xLength, zLength);
		return this.group;
	}

	initSeats({xLength, zLength}, seats) {
		const objLoader = new OBJLoader();
		const innerGroup = new THREE.Group();
		objLoader.load('./model/workstation/table.obj', (obj) => {
			// 单张桌子长度
			const { x, z } = this.getSize(obj);
			// 能放桌子的区域 比 目前桌子长
			// TODO scale 计算错误
			// const scale = (zLength / seats.length - 1) / x;
			const scale = 0.25;
			obj.rotation.x = -Math.PI / 2;
			obj.rotation.z = Math.PI / 2;
			obj.scale.set(scale, scale, scale);
			const spacing = xLength / seats.length;
			const xCenter = zLength / 2;
			seats.forEach((row, idx) => {
				const seatGroup = this.renderSeatGroup(obj, row);
				// 根据区位设置坐标
				seatGroup.position.z = xCenter;
				seatGroup.position.x = spacing * idx;
				innerGroup.add(seatGroup);
			});
			innerGroup.position.x = -xLength / 2  + z;
			// TODO scale 计算错误
			innerGroup.position.z = -zLength / 2 - 66;
			this.group.add(innerGroup);
		})
	}
	renderSeatGroup(tableObject, seats) {
		// 按照南北 分为两排
		const seatGroup = new THREE.Group();
		const seatsLength = seats.length;
		const itemNumber = seatsLength / 2;
		// 获取每张桌子的宽高，用于拼接
		const { x, z } = this.getSize(tableObject);
		for (let i = 0; i < itemNumber; i ++) {
			const cloneEastObj = tableObject.clone();
			const cloneWestObj = tableObject.clone();
			const offset = (z * i);
			cloneWestObj.position.z = offset;
			cloneWestObj.position.x = 0;
			cloneEastObj.position.z = offset;
			cloneEastObj.position.x = x;
			seatGroup.add(this.renderSeat('west', cloneWestObj, seats[i]))
			seatGroup.add(this.renderSeat('east', cloneEastObj, seats[seatsLength - i]));
		}
		return seatGroup;
	}
	// TODO 添加资产
	renderSeat(type, seatObject, seatInfo) {
		return seatObject;
	}
	initFloor(xLength, zLength) {
		const floor = new THREE.Mesh(new THREE.BoxGeometry(xLength, 2, zLength), new THREE.MeshLambertMaterial( { color: '#ccc' } ));
		this.group.add(floor);
	}
	getSize(obj) {
		const box3 = new THREE.Box3();
		const v3 = new THREE.Vector3()
		box3.setFromObject(obj);
		return box3.getSize(v3);
	}
}
