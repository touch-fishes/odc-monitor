import * as THREE from '../build/three.module.js';
import { OrbitControls } from '../examples/jsm/controls/OrbitControls.js';
import Stats from '../examples/jsm/libs/stats.module.js';
import { Floor } from './model/floor/floor.js';
import { GlassWall } from './model/wall/glass-wall.js';
import { InnerWall } from './model/wall/inner-wall.js';
import { ExternalWall } from './model/wall/external-wall.js';
import { Workstation } from './model/workstation/workstation.js';
import { WALL_HEIGHT,WALL_THICKNESS, walls, floor, kitchenStation, robotStation, northSofaStation } from './data/buildings-data.js';
import {southWorkstationArea, southWorkstation, northWorkstationArea, northWorkstation} from './data/workstations-data.js'
import { createHighlightElement } from './util/highlight.js';
import { Kitchen } from './model/kitchen/kitchen.js';
import { Sofa } from './model/sofa/sofa.js';
import { Robot } from './model/robot-expressive/robot.js'
import { TWEEN } from '../examples/jsm/libs/tween.module.min.js';
import { KeyPoint } from './model/key-point/key-point.js'
import { arrowPositions } from './data/arrow.js';
import { animateOrbitCamera } from './util/camera.js';
import { Mousemove } from './event/mousemove.js';
import { Click } from './event/click.js';
import { globalEvent } from './event.js';
import { Monitor } from './model/monitor/monitor.js';
import { AppleHost } from './model/computer-host/apple-host.js';
import { Seat } from './model/seat/seat.js';

export class ODC {
	constructor() {
		// TODO 优化提取 处理依赖
		Promise.all([
			Monitor.loadResource(),
			// AppleHost.loadResource(),
			Seat.loadResource(),
		]).then(() => {
			this.odcGroup = new THREE.Group();

			this.renderer = this.initRender();

			this.camera = this.initCamera();

			this.oldCamera = this.initCamera();

			this.scene = this.initScene();

			this.initHelp()

			this.initLight();

			this.initEvent();

			// 渲染墙体结构
			this.renderWall();

			// 渲染地面
			this.renderFloor();

			// 渲染 ODC 工位
			this.renderStation(southWorkstationArea, southWorkstation, 'south');
			this.renderStation(northWorkstationArea, northWorkstation, 'north');

			// 渲染厨房
			this.renderKitchen();

			// 渲染可爱的机器人
			// this.renderRobot();

			this.renderNorthSofa();

			this.renderArrow();

			this.scene.add(this.odcGroup);

			this.locationODC();

			this.animate();
		});
	}
	initEvent() {
		document.getElementById('#switch-btn').addEventListener( 'click', (event) => {
			animateOrbitCamera(
				{camera: this.camera, controls: this.controls},
				{cameraPosition: this.camera.position, orbitTargetPosition: this.controls.target },
				{ cameraPosition: this.oldCamera.position, orbitTargetPosition: this.oldControls.target }
			)
		});
		window.addEventListener( 'resize', (event) => {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize( window.innerWidth, window.innerHeight );
		});
		// 事件准备
		const { composer, outlinePass } = createHighlightElement(this.scene, this.camera, this.renderer);
		this.highlightComposer = composer;
		this.highlightOutlinePass = outlinePass;
		// 移动事件
		const mousemoveEvent = new Mousemove({ camera: this.camera, highlightOutlinePass: this.highlightOutlinePass, controls: this.controls });
		globalEvent.addEventListener('addMousemoveObserver', ({ message }) => mousemoveEvent.addObservers(message))
		// 点击事件
		const clickEvent = new Click({ camera: this.camera, highlightOutlinePass: this.highlightOutlinePass, controls: this.controls });
		globalEvent.addEventListener('addClickObserver', ({ message }) => clickEvent.addObservers(message))

	}
	initHelp() {
		this.controls = new OrbitControls( this.camera, this.renderer.domElement );
		this.controls.screenSpacePanning = false;
		this.controls.maxPolarAngle = Math.PI / 2;
		this.oldControls = new OrbitControls( this.camera, this.renderer.domElement );
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
	initCamera() {
		const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 6000 );
		camera.position.set( -712, 1000,  -712);
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
		TWEEN.update();
		this.stats.update();
		this.highlightComposer.render();
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
	renderStation(workStationArea, workStation, type) {
		const {begin, end} = workStationArea;
		const { x, z } = this.getCenterOfModelArea(begin, end);
		const [beginX, beginY] = begin.map(this.scale);
		const [endX, endY] = end.map(this.scale);
		const theWorkstation = new Workstation(
			{},
			{ xLength: (endY - beginY), zLength: (endX- beginX) },
			workStation);
		theWorkstation.position.x = x;
		theWorkstation.position.z = z;
		if (type === 'north') {
			this.northWorkstation = theWorkstation;
			this.odcGroup.add(this.northWorkstation);
			globalEvent.dispatchEvent({ type: 'addClickObserver', message: [this.northWorkstation]});
		} else if (type === 'south') {
			this.southWorkstation = theWorkstation;
			this.odcGroup.add(this.southWorkstation);
			globalEvent.dispatchEvent({ type: 'addClickObserver', message: [this.southWorkstation]});
		}
	}

	renderKitchen() {
		const {begin, end} = kitchenStation;
		const { x, z } = this.getCenterOfModelArea(begin, end);
		const kitchen = new Kitchen();
		kitchen.position.z = z;
		kitchen.position.x = x;
		this.odcGroup.add(kitchen)
	}

	renderNorthSofa() {
		const {begin, end} = northSofaStation;
		const { x, z } = this.getCenterOfModelArea(begin, end);
		const sofa = new Sofa(begin, end, {x, z});
		this.odcGroup.add(sofa)
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

	// TODO 材质优化
	renderFloor() {
		this.odcGroup.add(new Floor(floor.begin.map(this.scale), floor.end.map(this.scale)));
	}

	renderArrow() {
		this.arrows = []
		arrowPositions.forEach(item=> {
			const {begin, end} = item;
			const { x, z } = this.getCenterOfModelArea(begin, end);
			const arrow = new KeyPoint(20);
			arrow.position.z = z;
			arrow.position.y = this.scale(WALL_HEIGHT);
			arrow.position.x = x;
			arrow.userData.isNeedLiftCamera = item.type === 'hight';
			this.arrows.push(arrow);
		})
		this.arrows.forEach((arrow) => this.odcGroup.add(arrow));
		globalEvent.dispatchEvent({ type: 'addClickObserver', message: this.arrows});
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
