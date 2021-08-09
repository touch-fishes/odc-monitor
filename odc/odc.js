import * as THREE from '../build/three.module.js';
import { OrbitControls } from '../examples/jsm/controls/OrbitControls.js';
import Stats from '../examples/jsm/libs/stats.module.js';


import { Floor } from './model/floor/floor.js';
import { GlassWall } from './model/wall/glass-wall.js';
import { InnerWall } from './model/wall/inner-wall.js';
import { ExternalWall } from './model/wall/external-wall.js';
import { Workstation } from './model/workstation/workstation.js';
import { Desktop } from './model/desktop/desktop.js';
import { WALL_HEIGHT,WALL_THICKNESS, walls, floor } from './data/buildings-data.js';
import { southWorkstationArea, southWorkstation } from './data/workstations-data.js'


export class ODC {
	constructor() {

		this.odcGroup = new THREE.Group();

		this.renderer = this.initRender();

		this.camera = this.initCamera();

		this.scene = this.initScene();

		this.initHelp()

		this.initLight();

		this.initEvent();

		this.animate();

		// 渲染墙体结构
		this.renderWall();

		// 渲染地面
		this.renderFloor();

		// 渲染 ODC 工位
		this.renderStation();

		// 渲染 工作 左面
		this.renderDesktop();

		this.scene.add(this.odcGroup);

		this.locationODC();
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
			const theArguments = [
				begin.map(item => this.scale(item)),
				end.map(item => this.scale(item)),
				this.scale(WALL_HEIGHT), this.scale(WALL_THICKNESS)];
			const wall = type === 'external'
				? new ExternalWall(...theArguments)
				: (type === 'glass' ? new GlassWall(...theArguments) : new InnerWall(...theArguments))
			this.odcGroup.add(wall);
		});
	}
	// TODO
	renderStation() {
		const {begin, end} = southWorkstationArea;
		const [beginX, beginY] = begin;
		const [endX, endY] = end;
		const southX = this.scale((beginX + endX) / 2);
		const southY = this.scale((beginY + endY) / 2);
		console.log(southX, southY)
		const theSouthWorkstation = new Workstation({begin: begin.map(this.scale), end: end.map(this.scale)}, southWorkstation);
		theSouthWorkstation.position.x = 492;
		theSouthWorkstation.position.z = 0;
		this.odcGroup.add(theSouthWorkstation);
	}
	// TODO
	renderDesktop() {
		this.odcGroup.add(new Desktop(2));
	}
	// TODO
	renderFloor() {
		this.odcGroup.add(new Floor(floor.begin.map(this.scale), floor.end.map(this.scale)));
	}
	locationODC() {
		const box3 = new THREE.Box3();
		box3.expandByObject(this.odcGroup);
		const center = new THREE.Vector3();
		box3.getCenter(center);

		this.odcGroup.position.x = this.odcGroup.position.x - center.x
		this.odcGroup.position.z = this.odcGroup.position.z - center.z
	}
}