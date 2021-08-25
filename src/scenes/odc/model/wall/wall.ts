import * as THREE from 'three';
import { Group, Material } from 'three';

import { ModelPointer } from '../../types';

/**
 * 墙体 仅支持笔直的墙，不打弯
 */
export class Wall extends Group {
    // TODO
    // eslint-disable-next-line max-params
    public constructor(begin: ModelPointer, end: ModelPointer, height: number, thickness: number) {
        super();
        const wall = new THREE.Mesh(
            this.initGeometry(begin, end, height, thickness),
            this.initMaterial(),
        );
        const [x, y, z] = this.calculatePosition(begin, end, height);
        wall.position.set(x, y, z);
        wall.rotation.y = this.calculateRotation(begin, end);
        this.add(wall);
    }

    protected initMaterial(): Material {
        return new THREE.MeshLambertMaterial({ color: '#67C23A' });
    }

    // TODO
    // eslint-disable-next-line max-params
    protected initGeometry(
        begin: ModelPointer,
        end: ModelPointer,
        height: number,
        thickness: number,
    ) {
        const [beginX, beginY] = begin;
        const [endX, endY] = end;
        const a = endX - beginX;
        const b = endY - beginY;
        const length = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
        return new THREE.BoxGeometry(thickness, height, length);
    }

    protected calculatePosition(begin: ModelPointer, end: ModelPointer, height: number) {
        const [beginX, beginY] = begin;
        const [endX, endY] = end;
        return [(endY + beginY) / 2, height / 2, (endX + beginX) / 2];
    }

    protected calculateRotation(begin: ModelPointer, end: ModelPointer) {
        const [beginX, beginY] = begin;
        const [endX, endY] = end;
        return Math.atan2(endY - beginY, endX - beginX);
    }
}
