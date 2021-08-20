import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { LoadingManager, Object3D } from 'three';

import { p } from '@/scenes/odc/util/path';

// TODO
/**
 * 北区沙发
 */
export class CoffeeTable extends THREE.Group {
    private static resource: Record<string, undefined | THREE.Object3D> = {
        coffeeTableObject3D: undefined,
    };

    public static loadResource(loadingManager?: LoadingManager) {
        return new Promise((resolve) => {
            const objLoader = new OBJLoader(loadingManager);
            objLoader.load(p('/3d-model/coffee-table/coffee-table.obj'), (obj: Object3D) => {
                const scale = 0.5;
                obj.scale.set(scale, scale, scale);
                CoffeeTable.resource.coffeeTableObject3D = obj;
                resolve({ coffeeTableObject3D: obj });
            });
        });
    }
    private readonly coffeeTable: THREE.Object3D;

    public constructor({ x, z }: { x: number; z: number }) {
        super();
        this.coffeeTable = this.createCoffeeTable();
        this.add(this.coffeeTable);
        this.position.z = z;
        this.position.x = x;
    }

    private createCoffeeTable() {
        if (!CoffeeTable.resource.coffeeTableObject3D) throw new Error('No Resource');
        const obj = CoffeeTable.resource.coffeeTableObject3D.clone();
        const scale = 0.5;
        obj.scale.set(scale, scale, scale);
        return obj;
    }
}
