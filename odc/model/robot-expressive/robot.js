import * as THREE from '../../../build/three.module.js';
import { GLTFLoader } from '../../../examples/jsm/loaders/GLTFLoader.js';

export class Robot {

    constructor() {
        this.group = new THREE.Group();
        this.initRobot();
        return this.group
    }

    initRobot() {
        const loader = new GLTFLoader();
        loader.load( './model/robot-expressive/robot-expressive.glb',  ( gltf ) => {
			const scale = 50;
			gltf.scene.scale.set(scale, scale, scale);
            this.group.add( gltf.scene );
        }, undefined, function ( e ) {
            console.error( e );
        } );
    }
}