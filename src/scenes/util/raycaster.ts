import * as THREE from 'three';

export const getIntersectedMesh = (
    { camera, raycasterInstance }: { camera: THREE.Camera; raycasterInstance: THREE.Raycaster },
    pointer: { x: number; y: number },
    intersectObject: THREE.Object3D[],
): THREE.Object3D | undefined => {
    raycasterInstance.setFromCamera(pointer, camera);
    const intersects = raycasterInstance.intersectObjects(intersectObject, true);
    if (intersects.length > 0) {
        return intersects[0].object;
    }
};

export const getIntersected = (
    { camera, raycasterInstance }: { camera: THREE.Camera; raycasterInstance: THREE.Raycaster },
    pointer: { x: number; y: number },
    intersectObject: THREE.Object3D[],
): THREE.Intersection | undefined => {
    raycasterInstance.setFromCamera(pointer, camera);
    const intersects = raycasterInstance.intersectObjects(intersectObject, true);
    if (intersects.length > 0) {
        return intersects[0];
    }
};
