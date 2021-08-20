import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

import { SofaObj3D } from '../../../types';

import { p } from '@/scenes/util/path';

// TODO
/**
 * 北区沙发
 */
export class Sofa extends THREE.Group {
    private static resource: Record<string, undefined | THREE.Object3D> = {
        sofaObject3D: undefined,
    };

    public static loadResource(loadManager: THREE.LoadingManager): Promise<SofaObj3D> {
        return new Promise((resolve) => {
            const objLoader = new OBJLoader(loadManager);
            objLoader.load(p('/3d-model/couch/couch.obj'), (obj) => {
                Sofa.resource.sofaObject3D = obj;
                resolve({ sofaObj3D: obj });
            });
        });
    }

    private readonly sofa: THREE.Object3D;

    public constructor(begin: number[], end: number[], { x, z }: { x: number; z: number }) {
        super();
        this.position.z = z;
        this.position.x = x;
        this.sofa = this.createSofa(begin, end);
        this.add(this.sofa);
    }

    private createSofa(begin: number[], end: number[]) {
        if (!Sofa.resource?.sofaObject3D) throw new Error('No Resource');
        const sofaObj = Sofa.resource.sofaObject3D.clone();
        const scale = 50;
        sofaObj.scale.set(116, scale, scale);
        sofaObj.rotation.x = -Math.PI / 2;
        const [beginX, beginY] = begin;
        const [endX, endY] = end;
        sofaObj.rotation.z = Math.atan2(endY - beginY, endX - beginX) + Math.PI / 2;
        sofaObj.translateY(-15);
        ((sofaObj.children[0] as THREE.Mesh).material as THREE.MeshPhongMaterial).color.set(
            0x4682b4,
        );
        return sofaObj;
    }
}
