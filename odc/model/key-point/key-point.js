import * as THREE from '../../../build/three.module.js';
import { animateOrbitCamera } from "../../util/camera.js";
import { handleMouseRaycaster } from '../../util/raycaster.js';
import { mixCLickObserver } from "../../event/click.js";

export class KeyPoint extends mixCLickObserver(THREE.Group){

	constructor(size) {
		super()
		this.looAtPosition = {x: 0, y: 0, z:0};
		this.arrow = new THREE.Mesh(this.createGeometry(size), this.createMaterial());
		this.arrow.userData.type = 'keypoint';
		this.add(this.arrow);
	}

	setLookAt(lookAt) {
		this.looAtPosition = lookAt;
	}

	createMaterial() {
		const loader = new THREE.TextureLoader();
		const texture = loader.load( './odc/texture/arrow.png');
        return new THREE.MeshBasicMaterial({
			map: texture,
			transparent: true,
			side: THREE.DoubleSide
		});
	}

	createGeometry(size) {
        const geometry = new THREE.PlaneGeometry(size, size);
		geometry.rotateX(Math.PI/2);
		return geometry;
	}

	observationArea({camera, controls}, activeMesh) {
		const {  x, y, z  } = activeMesh.getWorldPosition(new THREE.Vector3());
		// TODO
		// const { x: lookX } = activeMesh.parent.parent.desktop.getWorldPosition(new THREE.Vector3());
		// const heightY = activeMesh.userData.isNeedLiftCamera ? 100: y;
		// const basePosition = { x: lookX > x ? x - 6 : x + 6, y: heightY, z };
		const basePosition = { x, y, z };
		// const lockAtPosition = { x: lookX > x ? x + 100 : x - 100, y: heightY, z };
		animateOrbitCamera(
			{camera, controls},
			{cameraPosition: camera.position, orbitTargetPosition: controls.target },
			{ cameraPosition: basePosition, orbitTargetPosition: this.looAtPosition }
		)
	}


	onClick({highlightOutlinePass, camera, controls}, activeMesh) {
		if (activeMesh.userData.type === 'keypoint') {
			this.observationArea({camera, controls}, activeMesh);
		}
	}

	getClickObserveObjects() {
		return this.children;
	}
}
