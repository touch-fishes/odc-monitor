import * as THREE from '../../../build/three.module.js';

export class Arrow {
	/**
	 *
	 * @param begin
	 * @param end
	 * @returns {Mesh}
	 */
	constructor(rotation, size) {
		const arrow = new THREE.Mesh(this.initGeometry(rotation, size), this.initMaterial());
		arrow.userData.type = 'keypoint';
		return arrow;
	}
	/**
	 *
	 * @returns {MeshLambertMaterial}
	 */
	initMaterial() {
		const loader = new THREE.TextureLoader();
		const texture = loader.load( './odc/texture/arrow.png');
        var plane = new THREE.MeshBasicMaterial();
        plane.map = texture;
        plane.transparent = true;
        plane.side = THREE.DoubleSide;
		return plane
	}

	/**
	 *
	 * @param begin
	 * @param end
	 */
	initGeometry(rotation, size) {
        const geometry = new THREE.PlaneGeometry(size, size);
        const {x, y, z} = rotation;
        if (x) geometry.rotateX(x);
        if (y) geometry.rotateY(y);
		return geometry;
	}
}
