import * as THREE from 'three';

import { ModelPointer } from '../../types';

import { p } from '@/scenes/util/path';

// TODO

export class Floor extends THREE.Group {
    public constructor(begin: ModelPointer, end: ModelPointer) {
        super();
        const floor = new THREE.Mesh(this.initGeometry(begin, end), this.initMaterial());
        const [x, y, z] = this.calculatePosition(begin, end);
        floor.position.set(x, y, z);
        this.add(floor);
    }

    protected initMaterial() {
        const loader = new THREE.TextureLoader();
        const texture = loader.load(p('/texture/floor.jpeg'));
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        // uv两个方向纹理重复数量
        texture.repeat.set(2, 1);
        return new THREE.MeshLambertMaterial({
            color: '#5e98c6',
        });
    }

    protected initGeometry(begin: ModelPointer, end: ModelPointer) {
        const [beginX, beginY] = begin;
        const [endX, endY] = end;
        const width = endX - beginX;
        const height = endY - beginY;
        return new THREE.BoxGeometry(height, 2, width);
    }

    /**
     * 计算坐标
     */
    protected calculatePosition(begin: ModelPointer, end: ModelPointer) {
        const [beginX, beginY] = begin;
        const [endX, endY] = end;
        const width = endX - beginX;
        const height = endY - beginY;
        return [height / 2, 0, width / 2];
    }
}
