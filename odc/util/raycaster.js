
export const getIntersectedMesh = (context, pointer, intersectObject) => {
    const { camera, raycasterInstance } = context;
    raycasterInstance.setFromCamera(pointer, camera);
    const intersects = raycasterInstance.intersectObjects(intersectObject, true);
    if (intersects.length > 0) {
        return intersects[0].object;
    }
    return null;
}

export const handleMouseRaycaster = (context, pointer, intersectObject, activeCallBack, inActiveCallback) => {
    const activeMesh = getIntersectedMesh(context, pointer, intersectObject);
    if (activeMesh) {
        activeCallBack && activeCallBack(activeMesh);
    } else {
        inActiveCallback && inActiveCallback();
    }
}