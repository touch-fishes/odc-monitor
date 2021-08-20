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
        return new THREE.MeshLambertMaterial({
            color: '#56595c',
            transparent: true,
            opacity: 1,
        });
    }
}
