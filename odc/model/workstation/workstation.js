import * as THREE from '../../../build/three.module.js';
import { OBJLoader } from '../../../examples/jsm/loaders/OBJLoader.js';
import { Desktop } from '../desktop/desktop.js';
import { StationInfo } from '../info/station-info.js';
import { clientX2X, clientY2Y } from '../../util/location.js';
import { handleMouseRaycaster } from '../../util/raycaster.js'
import { Arrow } from '../arrow/arrow.js'
import { Seat } from '../seat/seat.js';

// TODO 融合 北区工作区域 职责过于复杂
export class Workstation {
	constructor({camera, scene, renderer, controls, highlightComposer, highlightOutlinePass, raycaster}, {xLength, zLength}, seats) {
		this.group = new THREE.Group();
		Seat.loadResource().then((seatResource) => {
			this.seatResource = seatResource;
			const workstation = this.createWorkstation({xLength, zLength}, seats);
			this.group.add(workstation);
			// this.initFloor(xLength, zLength);
			// TODO 全局管理
			this.initMoveEvent(camera, scene, renderer, highlightComposer, highlightOutlinePass, controls);
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
			if (!this.loaded) return;
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
		const { x, z } = this.getSize(tempSeat.table);

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

	/**
	 * 初始化工位片区 比如，北边的一片工位
	 * @param xLength
	 * @param zLength
	 * @param seats
	 */
	initSeats({xLength, zLength}, seats) {
		const objLoader = new OBJLoader();
		const innerGroup = new THREE.Group();
		this.loaded = false;
		objLoader.load('./odc/model/workstation/table.obj', (obj) => {
			this.loaded = true;
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
				seatGroup.name = `seatRow_${idx}`
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

	/**
	 * 渲染一组工位
	 * @param tableObject
	 * @param seats
	 * @returns {Group}
	 */
	renderSeatGroup(tableObject, seats) {
		// 按照南北 分为两排
		const seatsGroup = new THREE.Group();
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
			seatsGroup.add(this.renderSeat('west', cloneWestObj, seats[i], i))
			seatsGroup.add(this.renderSeat('east', cloneEastObj, seats[seatsLength - i - 1], seatsLength - i - 1));
		}
		return seatsGroup;
	}

	/**
	 * 渲染单个工位（一个人对应的座位）
	 * @param type
	 * @param seatObject
	 * @param seatInfo
	 * @param index
	 * @returns {Group}
	 */
	renderSeat(type, seatObject, seatInfo, index) {
		const { y, z, x } = this.getSize(seatObject);
		const seatGroup = new THREE.Group();
		const desktopName = `desktop_${seatInfo.rowCode}_${index}`;
		const desktop = new Desktop(desktopName, seatInfo);
		// 工位蒲团， 用于点击观测工位
		const futon = new Arrow(20);
		desktop.name = desktopName;
		desktop.scale.set(0.25, 0.25, 0.25);
		desktop.position.y = y;
		seatObject.name = `table_${seatInfo.rowCode}_${index}`;
		// 桌子不需要高亮暂时关闭
		// seatObject.userData.highlight = true;
		seatObject.userData.type = 'table';
		seatGroup.add(seatObject);

		if (type === 'west') {
			desktop.position.z = seatObject.position.z - z/4;
			futon.position.z = seatObject.position.z
			futon.position.x = seatObject.position.x - 1.5 * x;
			futon.position.y = 10;
			futon.rotation.y = -Math.PI;
		}
		if (type === 'east') {
			desktop.position.z = seatObject.position.z + z/4;
			futon.position.z = seatObject.position.z;
			futon.position.x = seatObject.position.x + 1.5 * x;
			futon.position.y = 10;

			// 东排电脑是反方向的
			desktop.position.x = seatObject.position.x;
			desktop.rotation.y = -Math.PI;
		}
		seatGroup.add(desktop);
		seatGroup.add(futon);
		seatGroup.name = `seat_${seatInfo.rowCode}_${index}`
		return seatGroup;
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

	initFloor(xLength, zLength) {
		const floor = new THREE.Mesh(new THREE.BoxGeometry(xLength, 2, zLength), new THREE.MeshLambertMaterial( { color: '#ccc' } ));
		this.group.add(floor);
	}
	getSeats() {
		const allSeats = [];
		this.group.children.forEach((innerGroup) => {
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
		this.group.children.forEach((innerGroup) => {
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

	getSize(obj) {
		const box3 = new THREE.Box3();
		const v3 = new THREE.Vector3()
		box3.setFromObject(obj);
		return box3.getSize(v3);
	}
}
