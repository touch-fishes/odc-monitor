import * as THREE from '../build/three.module.js';
import { OrbitControls } from '../examples/jsm/controls/OrbitControls.js';
import Stats from '../examples/jsm/libs/stats.module.js';


import { Floor } from './model/floor/floor.js';
import { GlassWall } from './model/wall/glass-wall.js';
import { InnerWall } from './model/wall/inner-wall.js';
import { ExternalWall } from './model/wall/external-wall.js';
import { Workstation } from './model/workstation/workstation.js';
import { WALL_HEIGHT,WALL_THICKNESS, walls, floor, kitchenStation, robotStation } from './data/buildings-data.js';
import { southWorkstationArea, southWorkstation } from './data/workstations-data.js'
import { createHighlightElement } from './util/highlight.js';
import { Kitchen } from './model/kitchen/kitchen.js';
import { Robot } from './model/robot-expressive/robot.js'

export class ODC {
	constructor() {

		this.odcGroup = new THREE.Group();

		this.renderer = this.initRender();

		this.camera = this.initCamera();

		this.scene = this.initScene();

		this.initHighlight(this.scene, this.camera, this.renderer);

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

		// 渲染厨房
		this.renderKitchen();

		// 渲染可爱的机器人
		// this.renderRobot();

		this.scene.add(this.odcGroup);

		this.locationODC();
	}
	initEvent() {
		window.addEventListener( 'resize', (event) => {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize( window.innerWidth, window.innerHeight );
		});
	}
	initHelp() {
		this.controls = new OrbitControls( this.camera, this.renderer.domElement );
		this.controls.update();

		this.clock = new THREE.Clock();
		// 坐标轴
		const axesHelper = new THREE.AxesHelper(100)
		axesHelper.position.set(0,100,0);
		this.scene.add(axesHelper);
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
	initHighlight(scene, camera, renderer) {
		const { composer, outlinePass } = createHighlightElement(scene, camera, renderer);
		this.highlightComposer = composer;
		this.highlightOutlinePass = outlinePass;
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
		const dt = this.clock.getDelta();
		if ( this.mixer ) this.mixer.update( dt );
		requestAnimationFrame( this.animate.bind(this) );
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
		const { x, z } = this.getCenterOfModelArea(begin, end);
		const [beginX, beginY] = begin.map(this.scale);
		const [endX, endY] = end.map(this.scale);
		const theSouthWorkstation = new Workstation(
			{ camera: this.camera, scene: this.scene, renderer: this.renderer, highlightComposer: this.highlightComposer, highlightOutlinePass: this.highlightOutlinePass},
			{xLength: (endY - beginY), zLength: (endX- beginX)},
			southWorkstation);
		theSouthWorkstation.group.position.x = x;
		theSouthWorkstation.group.position.z = z;
		this.southWorkstation = theSouthWorkstation;
		this.odcGroup.add(this.southWorkstation.group);
	}

	renderKitchen() {
		const {begin, end} = kitchenStation;
		const { x, z } = this.getCenterOfModelArea(begin, end);
		const kitchen = new Kitchen();
		kitchen.position.z = z;
		kitchen.position.x = x;
		this.odcGroup.add(kitchen)
	}

	// todo
	renderRobot() {
		const {begin, end} = robotStation;
		const { x, z } = this.getCenterOfModelArea(begin, end);
		const robot = new Robot();
		robot.position.z = z;
		robot.position.x = x;
		this.odcGroup.add(robot);
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
	getCenterOfModelArea(begin, end) {
		const [beginX, beginY] = begin.map(this.scale);
		const [endX, endY] = end.map(this.scale);
		// 模型的 x 对应 坐标系 z 轴
		const centerZ = (beginX + endX) / 2;
		// 模型的 y 对应 坐标系 x 轴
		const centerX = (beginY + endY) / 2;
		return { x: centerX, z: centerZ };
	}
}
