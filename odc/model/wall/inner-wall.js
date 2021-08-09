import { Wall } from './wall.js'
import * as THREE from "../../../build/three.module.js";

export class InnerWall extends Wall {
	constructor(begin, end, height, thickness) {
		return super(begin, end, height, thickness);
	}
	initMaterial() {
		return new THREE.MeshLambertMaterial( {});
	}
}
