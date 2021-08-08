import * as THREE from '../../../build/three.module.js';

/**
 * 墙体 仅支持笔直的墙，不打弯
 */
export class Wall {
	/**
	 *
	 * @param begin
	 * @param end
	 * @param height
	 * @param thickness
	 * @returns {Mesh}
	 */
	constructor(begin, end, height, thickness) {
		const wall = new THREE.Mesh(this.initGeometry(begin, end, height, thickness), this.initMaterial());
		wall.position.set(...this.calculatePosition(begin, end, height));
		wall.rotation.y = this.calculateRotation(begin, end);
		return wall;
	}

	initMaterial() {
		return new THREE.MeshLambertMaterial( { color: '#67C23A',} );
	}

	/**
	 *
	 * @param begin
	 * @param end
	 * @param height
	 * @param thickness
	 */
	initGeometry(begin, end, height, thickness) {
		const [beginX, beginY] = begin;
		const [endX, endY] = end;
		const a = endX - beginX;
		const b = endY - beginY;
		const length = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
		return new THREE.BoxGeometry(thickness, height, length);
	}

	/**
	 * 计算坐标
	 */
	calculatePosition(begin, end, height) {
		const [beginX, beginY] = begin;
		const [endX, endY] = end;
		console.log('calculatePosition', (endX + beginX) / 2, (endY + beginY) / 2,  height)
		return [(endY + beginY) / 2, height/2, (endX + beginX) / 2 ]
	}

	/**
	 * 计算倾斜角度
	 * @param begin
	 * @param end
	 * @returns {number}
	 */
	calculateRotation(begin, end) {
		const [beginX, beginY] = begin;
		const [endX, endY] = end;
		return Math.atan2(endY - beginY, endX - beginX);
	}
}
