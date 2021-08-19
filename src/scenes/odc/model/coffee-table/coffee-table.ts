import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Object3D } from 'three';

import { CoffeeTableObj3D } from '@/scenes/types';

// TODO
/**
 * 北区沙发
 */
export class CoffeeTable extends THREE.Group {
    public static loadCoffeeTableResource(): Promise<CoffeeTableObj3D> {
        return new Promise((resolve) => {
            const objLoader = new OBJLoader();
            objLoader.load('/3d-model/coffee-table/coffee-table.obj', (obj: Object3D) => {
                resolve({ coffeeTableObj3D: obj });
            });
        });
    }

    public constructor(
        { coffeeTableObj3D }: CoffeeTableObj3D,
        { x, z }: { x: number; z: number },
    ) {
        super();
        this.add(coffeeTableObj3D);
        this.position.z = z;
        this.position.x = x;
    }
}
