import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import {Object3D} from "three";

// TODO
export class Kitchen extends THREE.Group {
    public constructor({kitchenObj}: {kitchenObj: Object3D}) {
        super();
        this.add(kitchenObj)
    }

  static loadKitchenResource(){
    return new Promise((resolve) => {
      const objLoader = new OBJLoader();
      objLoader.load('/3d-model/kitchen/kitchen.obj', (obj) => {
        const scale = 0.8;
        obj.scale.set(scale, scale, scale);
        (obj.children[0] as THREE.Mesh).material.color.set(0xdeb887);
        resolve({ kitchenObj: obj });
      });
    })
  }
}
