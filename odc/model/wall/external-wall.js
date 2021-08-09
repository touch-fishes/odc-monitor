import { Wall } from './wall.js'
import * as THREE from "../../../build/three.module.js";

export class ExternalWall extends Wall {
	constructor(begin, end, height, thickness) {
		return super(begin, end, height, thickness);
	}
	initMaterial() {
		const loader = new THREE.TextureLoader();
		const wallLoader = loader.load( './model/wall/texture/brick_diffuse.jpeg', () => {

		});
		return new THREE.MeshLambertMaterial( {
			bumpScale: 0.6,
			map: wallLoader
		});
	}
}