import * as THREE from '../../../build/three.module.js';
import { OBJLoader } from '../../../examples/jsm/loaders/OBJLoader.js';


// TODO
/**
 * 北区沙发
 */
export class Sofa {
	/**
	 *
	 * @param begin
	 * @param end
	 * @returns {Mesh}
	 */
	constructor(begin, end, {x, z}) {
		this.group = new THREE.Group();
		this.initNorthSofa(begin, end, {x, z});
		this.group.position.z = z;
		this.group.position.x = x;
		return this.group;
	}

	initNorthSofa(begin, end) {
		const objLoader = new OBJLoader();
		objLoader.load('./odc/model/sofa/couch.obj', (obj) => {
			const scale = 50;
			obj.scale.set(116, scale, scale);
			obj.rotation.x = -Math.PI / 2;
			const [beginX, beginY] = begin;
			const [endX, endY] = end;
			obj.rotation.z = Math.atan2(endY - beginY, endX - beginX) + Math.PI / 2;
			obj.translateY(-15)
			obj.children[0].material.color.set(0x4682B4);
			this.group.add(obj)
		});
	}
}
