import * as THREE from '../../build/three.module.js';


export const setHex = (obj, content) => {
	if (obj.material) {
		if (Array.isArray(obj.material)) {
			obj.material.forEach((material) => {
				material.emissive.setHex( content )
			});
		}
		if (obj.material.emissive) {
			obj.material.emissive.setHex( content );
		}
	}
}

export const getHex = (object) => {
	if (object.material && object.material.emissive) {
		return object.material.emissive.getHex();
	}
	return '';
}

export const getSize = (obj) => {
	const box3 = new THREE.Box3();
	const v3 = new THREE.Vector3()
	box3.setFromObject(obj);
	return box3.getSize(v3);
}

export const setEqualScale = (obj, scale) => {
	const {x: oldX, y: oldY, z: oldZ}  = obj.scale;
	obj.scale.set(oldX * scale, oldY * scale, oldZ * scale);
}
