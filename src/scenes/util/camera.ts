import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export const animateOrbitCamera = (
    { camera, controls }: { camera: THREE.Camera; controls: OrbitControls },
    {
        cameraPosition,
        orbitTargetPosition,
    }: { cameraPosition: THREE.Vector3; orbitTargetPosition: THREE.Vector3 },
    {
        cameraPosition: endCameraPosition,
        orbitTargetPosition: endOrbitTargetPosition,
    }: { cameraPosition: THREE.Vector3; orbitTargetPosition: THREE.Vector3 },
) => {
    const tween = new TWEEN.Tween({
        x1: cameraPosition.x, // 相机x
        y1: cameraPosition.y, // 相机y
        z1: cameraPosition.z, // 相机z
        x2: orbitTargetPosition.x, // 控制点的中心点x
        y2: orbitTargetPosition.y, // 控制点的中心点y
        z2: orbitTargetPosition.z, // 控制点的中心点z
    });
    tween.onStart(() => {
        controls.enabled = false;
    });
    tween.to(
        {
            x1: endCameraPosition.x,
            y1: endCameraPosition.y,
            z1: endCameraPosition.z,
            x2: endOrbitTargetPosition.x,
            y2: endOrbitTargetPosition.y,
            z2: endOrbitTargetPosition.z,
        },
        2000,
    );
    tween.onUpdate((result) => {
        camera.position.x = result.x1;
        camera.position.y = result.y1;
        camera.position.z = result.z1;
        controls.target.x = result.x2;
        controls.target.y = result.y2;
        controls.target.z = result.z2;
        controls.update();
    });
    tween.onComplete(() => {
        controls.enabled = true;
    });
    tween.easing(TWEEN.Easing.Cubic.InOut);
    tween.start();
};
