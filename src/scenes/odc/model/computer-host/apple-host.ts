import * as THREE from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

import { Host } from './host';

import { p } from '@/scenes/util/path';

export class AppleHost extends Host {
    public static clazzName = 'AppleHost';

    private static resource: Record<string, undefined | THREE.Object3D> = {
        logoObject3D: undefined,
    };

    public static loadResource() {
        return new Promise((resolve) => {
            new MTLLoader().load(p('/3d-model/apple-logo/apple-logo.mtl'), (materials) => {
                const objLoader = new OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.load(p('/3d-model/apple-logo/apple-logo.obj'), (obj) => {
                    AppleHost.resource.logoObject3D = obj;
                    resolve({ logoObject3D: obj });
                });
            });
        });
    }

    private readonly logo: THREE.Object3D | undefined;

    public constructor() {
        super();
        this.userData.clazzName = AppleHost.clazzName;
        this.logo = this.createLogo();
        this.add(this.logo);
    }

    protected createHostMaterial() {
        return new THREE.MeshLambertMaterial({ color: 'rgb(224,224,224)' });
    }

    private createLogo() {
        if (!AppleHost.resource.logoObject3D) throw new Error('No Resource');
        const obj = AppleHost.resource.logoObject3D.clone();
        obj.position.x = this.host.position.x - this.baseWidth / 2;
        obj.position.z = this.host.position.z;
        obj.position.y = this.baseHeight / 8;
        obj.rotation.y = -Math.PI / 2;
        obj.scale.set(0.04, 0.04, 0.04);
        return obj;
    }
}
