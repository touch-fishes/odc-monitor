import * as THREE from 'three';

import { Wall } from './wall';

import { ModelPointer } from '@/scenes/types';

export class ExternalWall extends Wall {
    // TODO
    // eslint-disable-next-line max-params
    public constructor(begin: ModelPointer, end: ModelPointer, height: number, thickness: number) {
        super(begin, end, height, thickness);
    }
    protected initMaterial() {
        const loader = new THREE.TextureLoader();
        const wallLoader = loader.load('/texture/brick_diffuse.png', () => {});
        return new THREE.MeshLambertMaterial({
            map: wallLoader,
        });
    }
}
