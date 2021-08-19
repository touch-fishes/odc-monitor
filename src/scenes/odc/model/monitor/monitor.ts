import * as THREE from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Group, Material, Mesh } from 'three';

import { p } from '@/scenes/odc/util/path';

export class Monitor extends THREE.Group {
    public static clazzName = 'monitor';

    private static resource: Record<string, undefined | Group> = {
        monitorObject3D: undefined,
    };

    public static loadResource() {
        return new Promise((resolve) => {
            new MTLLoader().load(p('/3d-model/monitor/monitor.mtl'), (materials) => {
                const objLoader = new OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.load(p('/3d-model/monitor/monitor.obj'), (obj) => {
                    Monitor.resource.monitorObject3D = obj;
                    return resolve({ monitorObject3D: obj });
                });
            });
        });
    }

    private readonly monitor: Group;

    private readonly screenMaterial: Material;

    public constructor() {
        super();
        this.monitor = this.createMonitor();
        this.userData.clazzName = Monitor.clazzName;
        // 用于备份高亮
        this.screenMaterial = (this.monitor.getObjectByName('Screen') as Mesh)
            .material as Material;
        this.add(this.monitor);
    }

    public active() {
        const loader = new THREE.TextureLoader();
        const screenTexture = loader.load(p('/texture/screen.png'));
        const screenMesh = this.monitor.getObjectByName('Screen');
        if (screenMesh instanceof Mesh) {
            screenMesh.material = new THREE.MeshPhongMaterial({
                map: screenTexture,
            });
        }
    }

    public silence() {
        const screenMesh = this.monitor.getObjectByName('Screen');
        if (screenMesh instanceof Mesh) {
            screenMesh.material = this.screenMaterial;
        }
    }

    private createMonitor = () => {
        if (!Monitor.resource.monitorObject3D) throw new Error('You have not loadResource');
        const monitor = Monitor.resource.monitorObject3D.clone();
        monitor.userData.external = true;
        return monitor;
    };
}
