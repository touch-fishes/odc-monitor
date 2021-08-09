import * as THREE from '../../../build/three.module.js';

/**
 * 墙体 仅支持笔直的墙，不打弯
 */
export class Floor {
	/**
	 *
	 * @param begin
	 * @param end
	 * @returns {Mesh}
	 */
	constructor(begin, end) {
		const floor = new THREE.Mesh(this.initGeometry(begin, end), this.initMaterial());
		floor.position.set(...this.calculatePosition(begin, end));
		return floor;
	}
	/**
	 *
	 * @returns {MeshLambertMaterial}
	 */
	initMaterial() {
		return new THREE.MeshLambertMaterial( { color: '#67717b', shininess: 0, roughness: 1} );
	}

	/**
	 *
	 * @param begin
	 * @param end
	 */
	initGeometry(begin, end) {
		const [beginX, beginY] = begin;
		const [endX, endY] = end;
		const width = endX - beginX;
		const height = endY - beginY;
		return new THREE.BoxGeometry(height, 2, width);
	}

	/**
	 * 计算坐标
	 */
	calculatePosition(begin, end) {
		const [beginX, beginY] = begin;
		const [endX, endY] = end;
		const width = endX - beginX;
		const height = endY - beginY;
		return [height/2, 0, width/2]
	}
}