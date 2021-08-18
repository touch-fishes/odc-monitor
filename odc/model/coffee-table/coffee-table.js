import * as THREE from '../../../build/three.module.js';
import { OBJLoader } from '../../../examples/jsm/loaders/OBJLoader.js';


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
	constructor({coffeeTableObject}, {x, z}) {
		super();
		this.add(coffeeTableObject);
		this.position.z = z;
		this.position.x = x;
	}

	static loadCoffeeTableResource() {
		return new Promise((resolve) => {
			const objLoader = new OBJLoader();
			objLoader.load('./odc/model/coffee-table/coffee-table.obj', (obj) => {
				resolve({ coffeeTableObject: obj });
			});
		})
	}
}
