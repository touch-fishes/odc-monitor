import * as THREE from '../../../build/three.module.js';

export class Host extends THREE.Group{
	constructor() {
		super();
		this.baseHeight = 18;
		this.baseDepth = 6;
		this.baseWidth = 18;
		this.host = this.createHost();
		this.hostmMaterial = this.host.material;
		this.add(this.host)
	}

	createHostGeometry() {
		return new THREE.BoxGeometry(this.baseWidth, this.baseHeight, this.baseDepth);
	}

	createHostMaterial() {
		return new THREE.MeshLambertMaterial( { color: '#282c34',} );
	}

	createHost() {
		return new THREE.Mesh(this.createHostGeometry(), this.createHostMaterial());
	}

	active() {
		this.host.material = new THREE.MeshPhongMaterial( { color: 0x409EFF});
	}

	silence() {
		this.host.material = this.hostmMaterial;
	}
}
