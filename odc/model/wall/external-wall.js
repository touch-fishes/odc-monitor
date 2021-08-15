import { Wall } from './wall.js'
import * as THREE from "../../../build/three.module.js";

export class ExternalWall extends Wall {
	constructor(begin, end, height, thickness) {
		return super(begin, end, height, thickness);
	}
	initMaterial() {
		const loader = new THREE.TextureLoader();
		const wallLoader = loader.load( './odc/texture/brick_diffuse.png', () => {

		});
		return new THREE.MeshLambertMaterial( {
			map: wallLoader
		});
	}
}
