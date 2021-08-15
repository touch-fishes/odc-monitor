import { Wall } from './wall.js'
import * as THREE from "../../../build/three.module.js";

export class GlassWall extends Wall {
	constructor(begin, end, height, thickness) {
		return super(begin, end, height, thickness);
	}
	initMaterial() {
		return new THREE.MeshBasicMaterial( { color: 0XECF1F3, transparent: true, opacity: 0.4 } );
	}
}
