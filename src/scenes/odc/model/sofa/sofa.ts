import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

import { SofaObj3D } from '../../../types';

// TODO
/**
 * 北区沙发
 */
export class Sofa extends THREE.Group {
    public static loadNorthSofaResource({
        begin,
        end,
    }: {
        begin: number[];
        end: number[];
    }): Promise<SofaObj3D> {
        return new Promise((resolve) => {
            const objLoader = new OBJLoader();
            objLoader.load('/3d-model/couch/couch.obj', (obj) => {
                const scale = 50;
                obj.scale.set(116, scale, scale);
                obj.rotation.x = -Math.PI / 2;
                const [beginX, beginY] = begin;
                const [endX, endY] = end;
                obj.rotation.z = Math.atan2(endY - beginY, endX - beginX) + Math.PI / 2;
                obj.translateY(-15);
                ((obj.children[0] as THREE.Mesh).material as THREE.MeshPhongMaterial).color.set(
                    0x4682b4,
                );
                resolve({ sofaObj3D: obj });
            });
        });
    }

    // eslint-disable-next-line max-params
    public constructor(
        { sofaObj3D }: SofaObj3D,
        begin: number[],
        end: number[],
        { x, z }: { x: number; z: number },
    ) {
        super();
        this.position.z = z;
        this.position.x = x;
        this.add(sofaObj3D);
    }
}
