import * as THREE from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

import { Host } from './host';

export class AppleHost extends Host {
    public static clazzName = 'AppleHost';

    private static resource: Record<string, undefined | THREE.Object3D> = {
        logoObject3D: undefined,
    };

    public static loadResource() {
        return new Promise((resolve) => {
            new MTLLoader().load('/3d-model/apple-logo/apple-logo.mtl', (materials) => {
                const objLoader = new OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.load('/3d-model/apple-logo/apple-logo.obj', (obj) => {
                    AppleHost.resource.logoObject3D = obj;
                    resolve({ logoObject3D: obj });
                });
            });
        });
    }

    // TODO
    private logo: THREE.Object3D | undefined;

    public constructor() {
        super();
        this.userData.clazzName = AppleHost.clazzName;
        this.createLogo().then((logo) => {
            this.logo = logo;
            this.add(this.logo);
        });
    }

    protected createHostMaterial() {
        return new THREE.MeshLambertMaterial({});
    }

    private createLogo(): Promise<THREE.Object3D> {
        // TODO 修改为依赖注入模式
        return new Promise((resolve) => {
            new MTLLoader().load(
                '/3d-model/apple-logo/apple-logo.mtl',
                (materials) => {
                    const objLoader = new OBJLoader();
                    objLoader.setMaterials(materials);
                    objLoader.load(
                        '/3d-model/apple-logo/apple-logo.obj',
                        (obj) => {
                            obj.position.x = this.host.position.x - this.baseWidth / 2;
                            obj.position.z = this.host.position.z;
                            obj.position.y = this.baseHeight / 8;
                            obj.rotation.y = -Math.PI / 2;
                            obj.scale.set(0.04, 0.04, 0.04);
                            resolve(obj);
                        },
                    );
                },
            );
        });
        // const obj = AppleHost.resource.logoObject3D.clone();
        // obj.position.x = this.host.position.x - (this.baseWidth/2);
        // obj.position.z = this.host.position.z;
        // obj.position.y = this.baseHeight / 8;
        // obj.rotation.y = - Math.PI/2;
        // obj.scale.set(0.04,0.04,0.04);
        // return obj;
    }
}
