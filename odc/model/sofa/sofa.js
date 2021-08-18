import * as THREE from '../../../build/three.module.js';
import { OBJLoader } from '../../../examples/jsm/loaders/OBJLoader.js';


// TODO
/**
 * 北区沙发
 */
export class Sofa extends THREE.Group{
	/**
	 *
	 * @param begin
	 * @param end
	 * @returns {Mesh}
	 */
	constructor({sofaObject3D}, begin, end, {x, z}) {
		super()
		this.position.z = z;
		this.position.x = x;
		this.add(sofaObject3D);
	}

	static loadNorthSofaResource({begin, end}) {
		return new Promise((resolve) => {
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
				resolve({ sofaObject3D: obj });
			});
		})
	}
}
