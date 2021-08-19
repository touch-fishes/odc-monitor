import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Object3D } from 'three';

import { CoffeeTableObj3D } from '@/scenes/types';
import { p } from '@/scenes/odc/util/path';

// TODO
/**
 * 北区沙发
 */
export class CoffeeTable extends THREE.Group {
    public static loadCoffeeTableResource(): Promise<CoffeeTableObj3D> {
        return new Promise((resolve) => {
            const objLoader = new OBJLoader();
            objLoader.load(p('/3d-model/coffee-table/coffee-table.obj'), (obj: Object3D) => {
                const scale = 0.5;
                obj.scale.set(scale, scale, scale);
                resolve({ coffeeTableObj3D: obj });
            });
        });
    }
    /**
     *
     * @param begin
     * @param end
     * @returns {Mesh}
     */
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
