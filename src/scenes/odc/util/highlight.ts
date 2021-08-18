import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';

export const createHighlightElement = (
    scene: THREE.Scene,
    camera: THREE.Camera,
    renderer: THREE.WebGLRenderer,
) => {
    // 效果组合器
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const outlinePass = new OutlinePass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        scene,
        camera,
    );

    // 高亮效果配置
    outlinePass.edgeStrength = Number(3);
    outlinePass.edgeGlow = Number(0);
    outlinePass.edgeThickness = Number(1);
    outlinePass.pulsePeriod = Number(0);
    outlinePass.usePatternTexture = false;
    outlinePass.visibleEdgeColor.set('#ffffff');
    outlinePass.hiddenEdgeColor.set('#190a05');

    composer.addPass(outlinePass);

    // TODO
    const effectFXAA = new ShaderPass(FXAAShader);
    effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
    composer.addPass(effectFXAA);

    return {
        // 暴漏给外界使用渲染 composer.render()
        composer,
        // 暴漏给外界用于，添加高亮元素 outlinePass.selectedObjects = [ activeObjects ]
        outlinePass,
    };
};
