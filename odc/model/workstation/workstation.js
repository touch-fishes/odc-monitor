import * as THREE from '../../../build/three.module.js';
import { StationInfo } from '../info/station-info.js';
import { Seat } from '../seat/seat.js';
import { getSize } from "../../util/object3D.js";
import { mixMousemoveObserver } from '../../event/mousemove.js';
import { mixCLickObserver } from '../../event/click.js';

// TODO 融合 北区工作区域 职责过于复杂
export class Workstation extends mixCLickObserver(mixMousemoveObserver(THREE.Group)){
	constructor({}, {xLength, zLength}, seats) {
		super();
		// 初始化信息面板
		this.seatInfoPlan = new StationInfo();
		// TODO 修改为依赖注入的模式
		Seat.loadResource().then((seatResource) => {
			this.seatResource = seatResource;
			const workstation = this.createWorkstation({xLength, zLength}, seats);
			this.add(workstation);
			// TODO 私有化
			const loader = new THREE.TextureLoader();
			this.texture = loader.load( './odc/texture/screen.png');
		});
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

	onUnMousemove({ highlightOutlinePass }) {}

	onMousemove({ highlightOutlinePass }, activeMesh) {
		// 是不是可以进行高亮操作
		const isHighlightMesh = activeMesh.parent.userData.highlight;
		if (isHighlightMesh) {
			highlightOutlinePass.selectedObjects = [activeMesh.parent];
		}
	}

	onClick({highlightOutlinePass}, activeMesh) {
		// todo 层级太深了。。
		const getAllCacheMaterial = () => {
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
		const fillActiveMesh = (activeMesh) => {
			const cached = getAllCacheMaterial();
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
				if (activeMesh.parent.name.indexOf('monitor') > -1) {
					activeMesh.material = new THREE.MeshPhongMaterial( { map: this.texture});
				} else {
					activeMesh.material = new THREE.MeshPhongMaterial( { color: 0x409EFF});
				}
			}
		}
		// 是不是可以进行高亮操作
		const isHighlightMesh = activeMesh.parent.userData.highlight;
		if (isHighlightMesh) {
			fillActiveMesh(activeMesh.parent);
			this.seatInfoPlan.show(activeMesh.parent.parent.userData.data, activeMesh.parent.parent.userData.type);
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
