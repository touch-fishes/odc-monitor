import * as THREE from '../../../build/three.module.js';
import { StationInfo } from '../info/station-info.js';
import { Seat } from '../seat/seat.js';
import { getDefinedObject3D, getDefinedObject3DByName, getSize } from "../../util/object3D.js";
import { mixMousemoveObserver } from '../../event/mousemove.js';
import { mixCLickObserver } from '../../event/click.js';
import { Desktop } from '../desktop/desktop.js';

export class Workstation extends mixCLickObserver(mixMousemoveObserver(THREE.Group)){
	constructor({}, {xLength, zLength}, seats) {
		super();
		// 初始化信息面板
		this.seatInfoPlan = new StationInfo();
		const workstation = this.createWorkstation({xLength, zLength}, seats);
		this.add(workstation);
	}

	createWorkstation({xLength, zLength}, seats) {
		const spacing = xLength / seats.length;
		const xCenter = zLength / 2;
		const innerGroup = new THREE.Group();
		seats.forEach((row, idx) => {
			const seatGroup = this.createSeatGroup(row);
			seatGroup.name = `seatRow_${idx}`
			// 排列位置
			seatGroup.position.z = xCenter;
			seatGroup.position.x = spacing * idx;
			innerGroup.add(seatGroup);
		});
		// 前面要留点空位置
		innerGroup.position.x = -xLength / 2 + 60;
		// TODO scale 计算错误
		innerGroup.position.z = -xCenter - 66;
		return innerGroup;
	}
	createSeatGroup(rowSeats) {
		// 按照南北 分为两排
		const seatsGroup = new THREE.Group();
		const seatsLength = rowSeats.length;
		// 背靠背两排的个数
		const itemNumber = seatsLength / 2;
		const tempSeat = new Seat();
		const { x, z } = getSize(tempSeat.table);

		// 循环排列工位
		for (let i = 0; i < itemNumber; i ++) {
			// 创建一个 工位
			const eastSeat = new Seat(rowSeats[i]);
			// 获取宽高信息计算排列
			const westSeat = new Seat(rowSeats[seatsLength - i - 1]);
			const offset = (z * i);
			westSeat.position.z = offset;
			westSeat.position.x = 0;
			eastSeat.position.z = offset;
			// 东变的座位需要旋转下, 再移动桌子的距离
			eastSeat.rotation.y = -Math.PI;
			eastSeat.position.x = x;
			// 添加到分组中
			seatsGroup.add(westSeat)
			seatsGroup.add(eastSeat);
		}

		return seatsGroup;
	}

	// 暂时不需要在没有 hover 的时候做任何事情
	beforeMousemove({ highlightOutlinePass }) {}

	onMousemove({ highlightOutlinePass }, activeMesh) {
		// 是不是可以进行高亮操作
		const isHighlightMesh = activeMesh.parent.userData.highlight;
		if (isHighlightMesh) {
			highlightOutlinePass.selectedObjects = [activeMesh.parent];
		}
	}

	beforeClick() {
		// 清除上次高亮的设备
		if (this.activeDesktop) {
			this.activeDesktop.silence();
			this.activeDesktop = null;
			this.seatInfoPlan.hide();
		}
	}

	onClick({highlightOutlinePass}, activeMesh) {
		// 是不是可以进行高亮操作
		const definedObject3D = getDefinedObject3D(activeMesh);
		if (definedObject3D && definedObject3D.userData.highlight) {
			// 高亮当前的设备
			const desktop = getDefinedObject3DByName(activeMesh, Desktop.clazzName);
			if (desktop) {
				desktop.active(activeMesh);
				// 记录当前激活物
				this.activeDesktop = desktop;
			}
			this.seatInfoPlan.show(definedObject3D.userData.data, definedObject3D.userData.type);
		}
	}

	getMousemoveObserveObjects() {
		const allSeats = [];
		this.children.forEach((innerGroup) => {
			innerGroup.children.forEach((row) => {
				row.children.forEach((seat) => {
					allSeats.push(seat);
				})
			});
		});
		return allSeats;
	}

	getClickObserveObjects() {
		const allSeats = [];
		this.children.forEach((innerGroup) => {
			innerGroup.children.forEach((row) => {
				row.children.forEach((seat) => {
					allSeats.push(seat);
				})
			});
		});
		return allSeats;
	}
}
