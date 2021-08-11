import * as THREE from '../../../build/three.module.js';
import { OBJLoader } from '../../../examples/jsm/loaders/OBJLoader.js';
import { Desktop } from '../desktop/desktop.js';
import { setHex, getHex } from '../../util/object3D.js';

export class Workstation {
	constructor({xLength, zLength}, seats) {
		this.heightCatch = {};
		this.group = new THREE.Group();
		this.initSeats({xLength, zLength}, seats);
		// this.initFloor(xLength, zLength);
		this.initMoveEvent();
	}

	initMoveEvent() {
		this.movePointer = new THREE.Vector2();
		this.moveRaycaster = new THREE.Raycaster();
		this.activeStation = null;
		document.addEventListener( 'mousemove', (event) => {
			this.movePointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			this.movePointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		});
	}

	initSeats({xLength, zLength}, seats) {
		const objLoader = new OBJLoader();
		const innerGroup = new THREE.Group();
		this.loaded = false;
		objLoader.load('./model/workstation/table.obj', (obj) => {
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
	renderSeat(type, seatObject, seatInfo, index) {
		const { y, z } = this.getSize(seatObject);
		const seatGroup = new THREE.Group();
		const desktopName = `desktop_${seatInfo.rowCode}_${index}`;
		const desktop = new Desktop(desktopName, seatInfo.monitor.length);
		desktop.name = desktopName;
		desktop.scale.set(0.25, 0.25, 0.25);
		desktop.position.y = y;
		seatObject.name = `table_${seatInfo.rowCode}_${index}`;
		seatObject.userData.highlight = true;
		seatObject.userData.type = 'table';
		seatGroup.add(seatObject);
		if (type === 'west') {
			desktop.position.z = seatObject.position.z - z/4;
		}
		if (type === 'east') {
			desktop.position.z = seatObject.position.z + z/4;
			// 东排电脑是反方向的
			desktop.position.x = seatObject.position.x;
			desktop.rotation.y = -Math.PI;
		}
		seatGroup.add(desktop);
		seatGroup.name = `seat_${seatInfo.rowCode}_${index}`
		return seatGroup;
	}
	renderActiveStation(camera) {
		if (!this.loaded) return;
		const allSeats = this.getSeats();
		// 更新射线
		this.moveRaycaster.setFromCamera(this.movePointer, camera);
		// 计算物体和射线的交点（可能是 桌子 可能是 显示器 可能是 主机）
		const intersects = this.moveRaycaster.intersectObjects(allSeats, true);

		// 有交集
		if (intersects.length > 0) {
			// 第一个有交集的元素
			const firstObject = intersects[0].object;
			// 是不是可以进行高亮操作
			const isHighlightMesh = firstObject.parent.userData.highlight;
			// 高亮类型
			const elementType =  firstObject.parent.userData.type;
			// 当前元素不是正高亮的元素
			if (this.activeStation != firstObject && isHighlightMesh) {
				// 存在高亮元素 恢复高亮元素 颜色
				if (this.activeStation) {
					setHex(this.activeStation, this.activeStation.currentHex);
				}
				// 记录高亮元素以及原始色彩
				this.activeStation = firstObject;
				this.activeStation.currentHex = getHex(this.activeStation);
				// 高亮
				this.highlightElement(elementType, this.activeStation);
			}
		} else {
			// 无交叉元素， 当前还有激活元素，恢复元素本色
			if (this.activeStation) {
				setHex(this.activeStation, this.activeStation.currentHex);
			}
			// 移除高亮元素
			this.activeStation = null;
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
	getSize(obj) {
		const box3 = new THREE.Box3();
		const v3 = new THREE.Vector3()
		box3.setFromObject(obj);
		return box3.getSize(v3);
	}
	highlightElement(type, object, color) {
		const theColor = color || 0xff0000
		if (type === 'table') {
			setHex(object, theColor);
		}
		if (type === 'monitor') {
			setHex(object, theColor);
		}
		if (type === 'macmini') {
			setHex(object, theColor);
		}
		if (type === 'pc') {
			setHex(object,theColor);
		}
	}
}
