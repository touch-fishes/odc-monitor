import * as THREE from 'three';

export const getSize = (obj: THREE.Object3D) => {
    const box3 = new THREE.Box3();
    const v3 = new THREE.Vector3();
    box3.setFromObject(obj);
    return box3.getSize(v3);
};

export const setEqualScale = (obj: THREE.Object3D, scale: number) => {
    const { x: oldX, y: oldY, z: oldZ } = obj.scale;
    obj.scale.set(oldX * scale, oldY * scale, oldZ * scale);
};

export const getDefinedObject3D = (obj: THREE.Object3D): THREE.Object3D | undefined => {
    if (obj.parent) {
        // 找到 desktop 的标识
        return obj.parent?.userData.clazzName ? obj.parent : getDefinedObject3D(obj.parent);
    } else {
        return;
    }
};

export const getDefinedObject3DByName = (
    obj: THREE.Object3D,
    name: string,
): THREE.Object3D | undefined => {
    if (obj.parent) {
        // 找到 desktop 的标识
        return obj.parent.userData && obj.parent.userData.clazzName === name
            ? obj.parent
            : getDefinedObject3DByName(obj.parent, name);
    } else {
        return;
    }
};
