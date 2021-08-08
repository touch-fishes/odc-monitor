import * as THREE from '../build/three.module.js';
import { OrbitControls } from '../examples/jsm/controls/OrbitControls.js';
import Stats from '../examples/jsm/libs/stats.module.js';

import { Wall } from './model/wall/wall.js';
import { Desktop } from './model/desktop/desktop.js';
import {WALL_HEIGHT,WALL_THICKNESS, walls} from "./measurement-data.js";


export class ODC {
	constructor() {

		this.renderer = this.initRender();

		this.camera = this.initCamera();

		this.scene = this.initScene();

		this.initHelp()

		this.initLight();

		this.initEvent();

		this.animate();

		// 渲染墙体结构
		this.renderWall();

		// 渲染 ODC 工位
		this.renderStation();

		// 渲染 工作 左面
		this.renderDesktop();
	}
	initEvent() {
		window.addEventListener( 'resize', (event) => {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize( window.innerWidth, window.innerHeight );
		} );
	}
	initHelp() {
		this.controls = new OrbitControls( this.camera, this.renderer.domElement );
		this.controls.update();
		this.stats = new Stats();
		document.body.appendChild(this.stats.dom);
		this.scene.add(new THREE.GridHelper( 2000, 50 ));
	}
	initLight() {
		const ambientLight = new THREE.AmbientLight( 0x606060 );
		this.scene.add( ambientLight );

		const directionalLight = new THREE.DirectionalLight( 0xffffff );
		directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
		this.scene.add( directionalLight );
	}
	initCamera() {
		const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
		camera.position.set( 800, 800, 800 );
		camera.lookAt( 0, 0, 0 );
		return camera;
	}
	initScene () {
		const scene = new THREE.Scene();
		scene.background = new THREE.Color( '#2b3a42' );
		return scene;
	}
	initRender() {
		const renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );

		document.body.appendChild( renderer.domElement );
		return renderer;
	}
	animate() {
		requestAnimationFrame( this.animate.bind(this) );
		this.renderer.render( this.scene, this.camera );
		this.stats.update();
	}
	scale(measurement) {
		const measurementLength = 71200;
		const viewLength = 1600;
		return (measurement * viewLength) / measurementLength;
	}
	renderWall() {
		walls.forEach(({type, begin, end}) => {
			this.scene.add(new Wall(
				begin.map(item => this.scale(item)),
				end.map(item => this.scale(item)),
				this.scale(WALL_HEIGHT), this.scale(WALL_THICKNESS)));
		});
	}
	// TODO
	renderStation() {

	}
	// TODO
	renderDesktop() {
		this.scene.add(new Desktop(2));
	}
}
