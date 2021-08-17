import { clientX2X, clientY2Y } from '../util/location.js';
import { handleMouseRaycaster } from '../util/raycaster.js';
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

	initEvent(observers) {
		document.addEventListener( 'mousemove', (event) => {
			const observers = this.observers;
			const x = clientX2X(event.clientX);
			const y = clientY2Y(event.clientY);
			requestAnimationFrame(() => {
				handleMouseRaycaster(
					{camera: this.camera, raycasterInstance: this.moveRaycaster},
					{ x, y },
					observers.reduce((acc, observer) => {
						return [
							...acc,
							...observer.getMousemoveObserveObjects()
						]
					}, []),
					(activeMesh) => {
						observers.forEach((observer) => {
							observer.onMousemove({ highlightOutlinePass: this.highlightOutlinePass }, activeMesh);
						});
					},
					() => {
						observers.forEach((observer) => {
							observer.onUnMousemove({ highlightOutlinePass: this.highlightOutlinePass });
						});
					});
			})
		});
	}
	addEvent(observers) {
		this.observers.push(...observers);
	}
}
