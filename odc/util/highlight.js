import * as THREE from '../../build/three.module.js';
import { EffectComposer } from '../../examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../../examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from '../../examples/jsm/postprocessing/OutlinePass.js';
import { ShaderPass } from '../../examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from '../../examples/jsm/shaders/FXAAShader.js';

export const createHighlightElement = (scene, camera, renderer) => {
	// 效果组合器
	const composer = new EffectComposer( renderer );
	composer.addPass(new RenderPass( scene, camera ));

	const outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );

	// 高亮效果配置
	outlinePass.edgeStrength = Number( 3.0 );
	outlinePass.edgeGlow = Number( 0.0 );
	outlinePass.edgeThickness = Number( 1.0 );
	outlinePass.pulsePeriod = Number( 0 );
	outlinePass.usePatternTexture = false;
	outlinePass.visibleEdgeColor.set( '#ffffff' );
	outlinePass.hiddenEdgeColor.set( '#190a05' );

	composer.addPass( outlinePass );

	// TODO
	const effectFXAA = new ShaderPass( FXAAShader );
	effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
	composer.addPass( effectFXAA );

	return {
		// 暴漏给外界使用渲染 composer.render()
		composer,
		// 暴漏给外界用于，添加高亮元素 outlinePass.selectedObjects = [ activeObjects ]
		outlinePass
	}
}
