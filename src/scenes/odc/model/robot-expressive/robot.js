import * as THREE from 'three';

export class Robot {
    constructor() {
        this.group = new THREE.Group();
        this.initRobot();
        return this.group;
    }

    initRobot() {
        const loader = new GLTFLoader();
        // TODO 修改为全局
        loader.load(
            '/3d-model/robot-expressive/robot-expressive.glb',
            (gltf) => {
                const scale = 12;
                gltf.scene.scale.set(scale, scale, scale);
                gltf.scene.rotation.y = Math.PI / 2;
                this.group.add(gltf.scene);
                this.playRobotAction(gltf.scene, gltf.animations);
            },
            undefined,
            (e) => {
                console.error(e);
            },
        );
    }

    playRobotAction(model, animations) {
        this.mixer = new THREE.AnimationMixer(model);
        const actions = {};
        for (const clip of animations) {
            const action = this.mixer.clipAction(clip);
            actions[clip.name] = action;
        }
        const activeAction = actions['Walking'];
        activeAction.play();
    }
}
