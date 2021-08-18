import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Object3D } from "three";

export class CameraMonitor extends THREE.Group{

	public constructor({cameraMonitorObj}: {cameraMonitorObj: Object3D}, {x, y, z}: {x: number, y: number, z: number}) {
		super();
		this.position.z = z;
		this.position.x = x;
		this.position.y = y;
		const temp = cameraMonitorObj.clone();
		this.add(temp);
	}

	static loadCameraMonitorResource(){
		return new Promise((resolve) => {
			const objLoader = new OBJLoader();
			objLoader.load('/3d-model/camera-monitor/camera-monitor.obj', (obj) => {
				const scale = 0.5;
				obj.scale.set(scale, scale, scale)
				obj.rotation.x = -Math.PI;
				resolve({ cameraMonitorObj: obj });
			});
		})
	}
}
