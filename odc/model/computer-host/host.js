import * as THREE from '../../../build/three.module.js';

export class Host {
	constructor() {
		this.group = new THREE.Group();
		this.baseHeight = 18;
		this.baseDepth = 6;
		this.baseWidth = 18;
		this.host = new THREE.Mesh(this.initGeometry(), this.initMaterial());
		// this.calculatePosition({x, z});
		this.renderLog()
		this.group.add(this.host)
		return this.group;

	}

	initMaterial() {
		return new THREE.MeshLambertMaterial( { color: '#282c34',} );
	}

	initGeometry() {
		return new THREE.BoxGeometry(this.baseWidth, this.baseHeight, this.baseDepth);
	}

	calculatePosition({x, z}) {
		this.host.position.y = this.baseHeight / 2;
		this.host.position.x = x;
		this.host.position.z = z;
	}

	renderLog() {}
}
