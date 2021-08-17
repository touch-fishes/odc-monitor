import { clientX2X, clientY2Y } from '../util/location.js';
import { handleMouseRaycaster } from '../util/raycaster.js';
import * as THREE from '../../build/three.module.js';

export const mixCLickObserver = (ObjectClass) => class MousemoveObserver extends ObjectClass {
	onClick () {}
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

	initEvent() {
		document.addEventListener( 'click', (event) => {
			const x = clientX2X(event.clientX);
			const y = clientY2Y(event.clientY);
			const observers = this.observers;
			// requestAnimationFrame(() => {
			// 	handleMouseRaycaster(
			// 		{ camera: this.camera, raycasterInstance: this.clickRaycaster },
			// 		{ x, y },
			// 		observers.reduce((acc, observer) => {
			// 			return [
			// 				...acc,
			// 				...observer.getClickObserveObjects()
			// 			]
			// 		}, []),
			// 		(activeMesh) => {
			// 			observers.forEach((observer) => {
			// 				observer.onClick({ highlightOutlinePass: this.highlightOutlinePass, controls: this.controls, camera: this.camera }, activeMesh);
			// 			});
			// 		})
			// })
			requestAnimationFrame(() => {
				observers.forEach((observer) => {
					handleMouseRaycaster({camera: this.camera, raycasterInstance: this.clickRaycaster}, { x, y }, observer.getClickObserveObjects(), (activeMesh) => {
						observer.onClick({ highlightOutlinePass: this.highlightOutlinePass, controls: this.controls, camera: this.camera }, activeMesh);
					});
				})
			})
		});
	}

	addEvent(observers) {
		this.observers.push(...observers);
	}
}
