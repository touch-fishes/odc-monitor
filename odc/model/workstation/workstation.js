import * as THREE from '../../../build/three.module.js';
import { StationInfo } from '../info/station-info.js';
import { clientX2X, clientY2Y } from '../../util/location.js';
import { handleMouseRaycaster } from '../../util/raycaster.js'
import { Seat } from '../seat/seat.js';
import { getSize } from "../../util/object3D.js";

// TODO 融合 北区工作区域 职责过于复杂
export class Workstation extends THREE.Group{
	constructor({camera, scene, renderer, controls, highlightComposer, highlightOutlinePass, raycaster}, {xLength, zLength}, seats) {
		super();
		// TODO 修改为依赖注入的模式
		Seat.loadResource().then((seatResource) => {
			this.seatResource = seatResource;
			const workstation = this.createWorkstation({xLength, zLength}, seats);
			this.add(workstation);
			// this.initFloor(xLength, zLength);
			// TODO 全局管理
			this.initMoveEvent(camera, highlightComposer, highlightOutlinePass, controls, raycaster);
			// 初始化信息面板
			this.seatInfoPlan = new StationInfo();
		});
	}

	initMoveEvent(camera, highlightComposer, highlightOutlinePass, controls, raycaster) {
		this.activeStation = null;
		this.moveActiveGroup = null;
		this.clickActiveGroup = null;
		const renderActiveGroup = (type) => (event) => {
			const x = clientX2X(event.clientX);
			const y = clientY2Y(event.clientY);
			// 鼠标移动时检测高亮
			requestAnimationFrame(() => {
				this.renderActiveMesh(type, {x,y}, {camera, controls, highlightComposer, highlightOutlinePass, raycaster}, );
			});
		}
		// TODO 全局管理
		document.addEventListener( 'mousemove', renderActiveGroup('move'));
		document.addEventListener( 'click', renderActiveGroup('click'));
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
		const tempSeat = new Seat(this.seatResource);
		const { x, z } = getSize(tempSeat.table);

		// 循环排列工位
		for (let i = 0; i < itemNumber; i ++) {
			// 创建一个 工位
			const eastSeat = new Seat(this.seatResource, rowSeats[i]);
			// 获取宽高信息计算排列
			const westSeat = new Seat(this.seatResource, rowSeats[seatsLength - i - 1]);
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

	getSelectedObjects() {
		if (this.clickActiveGroup && this.moveActiveGroup && this.moveActiveGroup === this.clickActiveGroup) {
			return [this.clickActiveGroup];
		}
		return [this.clickActiveGroup, this.moveActiveGroup].filter((item) => item)
	}

	renderActiveMesh(type, pointer, {camera, controls, highlightOutlinePass, raycaster}) {
		handleMouseRaycaster({camera, raycasterInstance: raycaster}, pointer, this.getSeats(), (activeMesh) => {
			// 是不是可以进行高亮操作
			const isHighlightMesh = activeMesh.parent.userData.highlight;
			// 属于可以高亮的元素
			if (isHighlightMesh) {
				if (type === 'click') {
					this.clickActiveGroup = activeMesh.parent;
					this.fillActiveMesh(activeMesh);
					this.seatInfoPlan.show(activeMesh.parent.userData.data, activeMesh.parent.userData.type);
				}
				if (type === 'move') this.moveActiveGroup = activeMesh.parent;
				highlightOutlinePass.selectedObjects = this.getSelectedObjects();
			} else {
				this.moveActiveGroup = null;
				highlightOutlinePass.selectedObjects = this.getSelectedObjects();
			}
		}, () => {
			this.moveActiveGroup = null;
			highlightOutlinePass.selectedObjects = this.getSelectedObjects();
		})
	}

	fillActiveMesh(activeMesh) {
		const cached = this.getAllCacheMaterial();
		if (this.oldActiveMesh) {
			this.oldActiveMesh.material = cached[this.oldActiveMesh.parent.name];
			this.oldActiveMesh.userData.clickFlag = false;
			this.oldActiveMesh = null;
		}
		if (activeMesh.userData.clickFlag) {
			activeMesh.material = cached[activeMesh.parent.name]
			activeMesh.userData.clickFlag = false;
		} else {
			activeMesh.userData.clickFlag = true;
			// 由于monitor使用了多个材质，并且是多个重复name的材质，所以下面的代码会产生重复的颜色
			// activeMesh.material[1].emissive.setHex( 0x409EFF );
			this.oldActiveMesh = activeMesh;
			activeMesh.material = new THREE.MeshPhongMaterial( { color: 0x409EFF});
		}
	}

	getSeats() {
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

	// todo 层级太深了。。
	getAllCacheMaterial() {
		const cacheMaterail = {};
		this.children.forEach((innerGroup) => {
			innerGroup.children.forEach((row) => {
				row.children.forEach((seat) => {
					seat.children.forEach(item => {
						if (item.name.indexOf('desktop') > -1) {
							item.children.forEach(desktop => {
								cacheMaterail[desktop.name] = desktop.userData.materials
							})
						}
					})
				})
			});
		});
		return cacheMaterail;
	}
}
