import * as THREE from '../../../build/three.module.js';
import { OBJLoader } from '../../../examples/jsm/loaders/OBJLoader.js';

export class Workstation {
	constructor({begin, end}, seats) {
		this.group = new THREE.Group();
		this.initSeats({begin, end}, seats);
		this.location();
		return this.group;
	}

	initSeats({begin, end}, seats) {
		const [beginX, beginY] = begin;
		const [endX, endY] = end;
		const yLenght = endY - beginY;
		const xLenght = endX - beginX;
		const objLoader = new OBJLoader();
		objLoader.load('./model/workstation/table.obj', (obj) => {
			obj.rotation.x = -Math.PI / 2;
			obj.rotation.z = Math.PI / 2;
			obj.position.x = -20;
			obj.scale.set(0.3, 0.3, 0.3);
			const spacing = yLenght/seats.length;
			const xCenter = xLenght/2;
			seats.forEach((row, idx) => {
				const seatGroup = this.renderSeatGroup(obj, row);
				// 根据区位设置坐标
				seatGroup.position.z = xCenter;
				seatGroup.position.x = spacing * idx;
				this.group.add(seatGroup);
			});
		})
	}
	renderSeatGroup(tableObject, seats) {
		// 按照南北 分为两排
		const seatGroup = new THREE.Group();
		const seatsLength = seats.length;
		const itemNumber = seatsLength / 2;
		// 获取每张桌子的宽高，用于拼接
		const { x,z } = this.getSize(tableObject);
		for (let i = 0; i < itemNumber; i ++) {
			const cloneEastObj = tableObject.clone();
			const cloneWestObj = tableObject.clone();
			cloneWestObj.position.z = (z * i);
			cloneWestObj.position.x = 0;
			cloneEastObj.position.z = (z * i);
			cloneEastObj.position.x = x;
			seatGroup.add(this.renderSeat('west', cloneWestObj, seats[i]))
			seatGroup.add(this.renderSeat('east', cloneEastObj, seats[seatsLength - i]));
		}
		return seatGroup;
	}
	renderSeat(type, seatObject, seatInfo) {
		return seatObject;
	}
	getSize(obj) {
		const box3 = new THREE.Box3();
		const v3 = new THREE.Vector3()
		box3.setFromObject(obj);
		return box3.getSize(v3);
	}
	location() {
		this.group.position.x = -50
	}
}
