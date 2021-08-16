import * as THREE from '../../../build/three.module.js';
import { clientX2X, clientY2Y } from "../../util/location.js";
import { animateOrbitCamera } from "../../util/camera.js";

export class Arrow extends THREE.Mesh{

	constructor(size, context) {
		super()
		this.geometry = this.initGeometry(size);
		this.material = this.initMaterial();
		this.userData.type = 'keypoint';
		if (context) {
			const { camera, scene, renderer, controls } = context;
			this.initMoveEvent(camera, scene, renderer, controls);
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

	initMoveEvent(camera, scene, renderer, controls) {
		this.moveRaycaster = new THREE.Raycaster();
		const renderActiveGroup = (type) => (event) => {
			const x = clientX2X(event.clientX);
			const y = clientY2Y(event.clientY);
			// 鼠标移动时检测高亮
			requestAnimationFrame(() => {
				this.renderActiveMesh(type, {x,y}, {camera, controls, scene}, );
			});
		};
		document.addEventListener( 'click', renderActiveGroup('click'));
	}

	getHighlightMesh(pointer, camera, scene) {
		// 更新射线
		this.moveRaycaster.setFromCamera(pointer, camera);
		const intersects = this.moveRaycaster.intersectObjects(scene.children, true);
		if (intersects.length > 0) {
			return intersects[0].object;
		}
		return null;
	}

	renderActiveMesh(type, pointer, {camera, controls, scene}) {
		// 获取激活 Mesh
		const activeMesh = this.getHighlightMesh(pointer, camera, scene);
		// 有交集
		if (activeMesh) {
			if (type === 'click' && activeMesh.userData.type === 'keypoint') {
				this.observationArea({camera, controls}, activeMesh);
			}
		}
	}

	observationArea({camera, controls}, activeMesh) {
		// 获取观测点坐标
		const {  x, y, z  } = activeMesh.getWorldPosition(new THREE.Vector3());
		// 获取座位坐标，需要调整摄像头看向座位
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
