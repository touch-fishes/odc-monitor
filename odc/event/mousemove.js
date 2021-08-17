import { clientX2X, clientY2Y } from '../util/location.js';
import { getIntersectedMesh, handleMouseRaycaster } from '../util/raycaster.js';
import * as THREE from '../../build/three.module.js';

export const mixMousemoveObserver = (ObjectClass) => class MousemoveObserver extends ObjectClass {
	onUnMousemove () {}
	onMousemove () {}
	getMousemoveObserveObjects() {}
}

export class Mousemove {
	constructor({ camera,highlightOutlinePass }) {
		// 被观测的实例
		this.observers = [];
		// 用于捕获光线
		this.camera = camera;
		this.moveRaycaster = new THREE.Raycaster();
		// 用于制作高亮
		this.highlightOutlinePass = highlightOutlinePass
		this.initEvent();
	}

	initEvent() {
		document.addEventListener( 'mousemove', (event) => {
			const observers = this.observers;
			const x = clientX2X(event.clientX);
			const y = clientY2Y(event.clientY);
			requestAnimationFrame(() => {
				// 移动执行前准备
				this.highlightOutlinePass.selectedObjects = [];
				// 遍历每一个观测者 找到中奖选手
				const observerGroup = observers.reduce((acc, observer) => {
					const activeMesh = getIntersectedMesh({ camera: this.camera, raycasterInstance: this.moveRaycaster }, { x, y }, observer.getMousemoveObserveObjects());
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
				// 遍历未中奖选手 安慰 (优先这样处理是防止对中奖选手产生影响,有的为中奖选手会 移除 this.highlightOutlinePass.selectedObjects)
				observerGroup.inactive.forEach(({observer}) => {
					if (observer.onUnMousemove) {
						observer.onUnMousemove({ highlightOutlinePass: this.highlightOutlinePass });
					}
				});
				// 遍历中奖选手 发奖 暂时不考虑头奖选手 不让其他 mesh 得奖
				observerGroup.active.forEach(({observer,  activeMesh}) => {
					if (observer.onMousemove) {
						observer.onMousemove({ highlightOutlinePass: this.highlightOutlinePass }, activeMesh);
					}
				});

				// observers.forEach((observer) => {
				// 	handleMouseRaycaster({camera: this.camera, raycasterInstance: this.moveRaycaster}, { x, y }, observer.getMousemoveObserveObjects(), (activeMesh) => {
				// 		observer.onMousemove({ highlightOutlinePass: this.highlightOutlinePass }, activeMesh);
				// 	}, () => {
				// 		observer.onUnMousemove({ highlightOutlinePass: this.highlightOutlinePass });
				// 	});
				// })
			})
		});
	}
	addEvent(observers) {
		this.observers.push(...observers);
	}
}
