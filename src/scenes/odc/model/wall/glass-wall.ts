import * as THREE from 'three';

import { ModelPointer } from '../../types';

import { Wall } from './wall';


export class GlassWall extends Wall {
    // TODO
    // eslint-disable-next-line max-params
    public constructor(begin: ModelPointer, end: ModelPointer, height: number, thickness: number) {
        super(begin, end, height, thickness);
    }
    protected initMaterial() {
        return new THREE.MeshBasicMaterial({ color: 0xECF1F3, transparent: true, opacity: 0.4 });
    }
}
