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


export const getDefinedObject3D = (obj) => {
	if (obj.parent) {
		// 找到 desktop 的标识
		if (obj.parent.userData && obj.parent.userData.clazzName) {
			return obj.parent;
		} else {
			return getDefinedObject3D(obj.parent);
		}
	} else {
		return null;
	}
}

export const getDefinedObject3DByName = (obj, name) => {
	if (obj.parent) {
		// 找到 desktop 的标识
		if (obj.parent.userData && obj.parent.userData.clazzName === name) {
			return obj.parent;
		} else {
			return getDefinedObject3DByName(obj.parent, name);
		}
	} else {
		return null;
	}
}
