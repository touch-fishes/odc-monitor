import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Object3D } from "three";


// TODO
/**
 * 北区沙发
 */
export class CoffeeTable extends THREE.Group{
  /**
   *
   * @param begin
   * @param end
   * @returns {Mesh}
   */
  public constructor({coffeeTableObject}: {coffeeTableObject: Object3D}, {x, z}: {x: number, z: number}) {
    super();
    this.add(coffeeTableObject);
    this.position.z = z;
    this.position.x = x;
  }

  static loadCoffeeTableResource() {
    return new Promise((resolve) => {
      const objLoader = new OBJLoader();
      objLoader.load('/3d-model/coffee-table/coffee-table.obj', (obj) => {
        resolve({ coffeeTableObject: obj });
      });
    })
  }
}
