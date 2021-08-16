import * as THREE from '../../../build/three.module.js';
import { clientX2X, clientY2Y } from "../../util/location.js";
import { animateOrbitCamera } from "../../util/camera.js";
import { handleMouseRaycaster } from '../../util/raycaster.js';

export class Arrow extends THREE.Mesh{

	constructor(size, context) {
		super()
		this.geometry = this.initGeometry(size);
		this.material = this.initMaterial();
		this.userData.type = 'keypoint';
		if (context) {
			const { camera, scene, raycaster, controls } = context;
			this.initMoveEvent(camera, scene, raycaster, controls);
		}
	}

	initMaterial() {
		const loader = new THREE.TextureLoader();
		const texture = loader.load( './odc/texture/arrow.png');
        return new THREE.MeshBasicMaterial({
			map: texture,
			transparent: true,
			side: THREE.DoubleSide
		});
	}

	initGeometry(size) {
        const geometry = new THREE.PlaneGeometry(size, size);
		geometry.rotateX(Math.PI/2);
		return geometry;
	}

	initMoveEvent(camera, scene, raycaster, controls) {
		const renderActiveGroup = (type) => (event) => {
			const x = clientX2X(event.clientX);
			const y = clientY2Y(event.clientY);
			// 鼠标移动时检测高亮
			requestAnimationFrame(() => {
				this.renderActiveMesh(type, {x,y}, {camera, controls, scene, raycaster}, );
			});
		};
		document.addEventListener( 'click', renderActiveGroup('click'));
	}

	renderActiveMesh(type, pointer, {camera, controls, scene, raycaster}) {
		handleMouseRaycaster({camera, raycasterInstance: raycaster}, pointer, scene.children, (activeMesh) => {
			if (type === 'click' && activeMesh.userData.type === 'keypoint') {
				this.observationArea({camera, controls}, activeMesh);
			}
		})
	}

	observationArea({camera, controls}, activeMesh) {
		const {  x, y, z  } = activeMesh.getWorldPosition(new THREE.Vector3());
		const { x: lookX } = activeMesh.parent.children[0].getWorldPosition(new THREE.Vector3());
		const heightY = activeMesh.userData.isNeedLiftCamera ? 100: y;
		const basePosition = { x: lookX > x ? x - 6 : x + 6, y: heightY, z };
		const lockAtPosition = { x: lookX > x ? x + 100 : x - 100, y: heightY, z };
		animateOrbitCamera(
			{camera, controls},
			{cameraPosition: camera.position, orbitTargetPosition: controls.target },
			{ cameraPosition: basePosition, orbitTargetPosition: lockAtPosition }
		)
	}
}
