import { clientX2X, clientY2Y } from '../util/location.js';
import { getIntersectedMesh } from '../util/raycaster.js';
import * as THREE from '../../build/three.module.js';

export const mixCLickObserver = (ObjectClass) => class MousemoveObserver extends ObjectClass {
	onClick () {}
	beforeClick() {}
	getClickObserveObjects() {}
}

export class Click {
	constructor({ camera,highlightOutlinePass,controls }) {
		// 被观测的实例
		this.observers = [];
		// 用于捕获光线
		this.camera = camera;
		this.controls = controls;
		this.clickRaycaster = new THREE.Raycaster();
		// 用于制作高亮
		this.highlightOutlinePass = highlightOutlinePass;
		this.initEvent();
	}

	// TODO 合理抽象
	getObserverGroup({ x, y }) {
		// 遍历每一个观测者 找到中奖选手
		return this.observers.reduce((acc, observer) => {
			const activeMesh = getIntersectedMesh({ camera: this.camera, raycasterInstance: this.clickRaycaster }, { x, y }, observer.getClickObserveObjects());
			if (activeMesh) {
				return {
					active: [...acc.active, { activeMesh, observer }],
					inactive: acc.inactive
				}
			} else {
				return {
					active: acc.active,
					inactive: [...acc.inactive, { observer }]
				}
			}
		}, { active: [],  inactive: [] });
	}

	initEvent() {
		document.addEventListener( 'click', (event) => {
			const x = clientX2X(event.clientX);
			const y = clientY2Y(event.clientY);
			// 遍历每一个观测者 找到中奖选手
			const observerGroup = this.getObserverGroup({x, y});
			observerGroup.inactive.forEach(({observer}) => {
				if (observer.beforeClick) observer.beforeClick();
			})
			// 遍历中奖选手 发奖 暂时不考虑头奖选手 不让其他 mesh 得奖
			observerGroup.active.forEach(({observer,  activeMesh}) => {
				if (observer.beforeClick) observer.beforeClick();
				if (observer.onClick) {
					observer.onClick({ highlightOutlinePass: this.highlightOutlinePass, controls: this.controls, camera: this.camera }, activeMesh);
				}
			});
		});
	}

	addObservers(observers) {
		this.observers.push(...observers);
	}
}
