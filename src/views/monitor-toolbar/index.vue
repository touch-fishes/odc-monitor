<template>
    <el-button-group class="toolbar">
        <el-button icon="el-icon-refresh" size="mini" @click="refresh"> 刷新 </el-button>
        <el-button
            icon="el-icon-view"
            size="mini"
            @click="handleClick(0, seatAreaType.north)"
            @mouseenter="handleMouseMove(0, seatAreaType.north)"
            @mouseleave="handleMouseMove(0, seatAreaType.north, 0)"
            >北1观测点</el-button
        >
        <el-button
            icon="el-icon-view"
            size="mini"
            @click="handleClick(1, seatAreaType.north)"
            @mouseenter="handleMouseMove(1, seatAreaType.north)"
            @mouseleave="handleMouseMove(1, seatAreaType.north, 0)"
            >北2观测点</el-button
        >
        <el-button
            icon="el-icon-view"
            size="mini"
            @click="handleClick(2, seatAreaType.north)"
            @mouseenter="handleMouseMove(2, seatAreaType.north)"
            @mouseleave="handleMouseMove(2, seatAreaType.north, 0)"
            >北3观测点</el-button
        >
        <el-button
            icon="el-icon-view"
            size="mini"
            @click="handleClick(3, seatAreaType.north)"
            @mouseenter="handleMouseMove(3, seatAreaType.north)"
            @mouseleave="handleMouseMove(3, seatAreaType.north, 0)"
            >北4观测点</el-button
        >
        <el-button
            icon="el-icon-view"
            size="mini"
            @click="handleClick(2, seatAreaType.south)"
            @mouseenter="handleMouseMove(2, seatAreaType.south)"
            @mouseleave="handleMouseMove(2, seatAreaType.south, 0)"
            >南3观测点</el-button
        >
        <el-button
            icon="el-icon-view"
            size="mini"
            @click="handleClick(1, seatAreaType.south)"
            @mouseenter="handleMouseMove(1, seatAreaType.south)"
            @mouseleave="handleMouseMove(1, seatAreaType.south, 0)"
            >南2观测点</el-button
        >
        <el-button
            icon="el-icon-view"
            size="mini"
            @click="handleClick(0, seatAreaType.south)"
            @mouseenter="handleMouseMove(0, seatAreaType.south)"
            @mouseleave="handleMouseMove(0, seatAreaType.south, 0)"
            >南1观测点</el-button
        >
    </el-button-group>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { ElButton, ElButtonGroup } from 'element-plus';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { CameraMonitor } from '@/scenes/odc/model/camera-monitor/camera-monitor';
import { SeatAreaType } from '@/data/workstations-data';

interface OdcInstance {
    structure: {
        northCameraMonitors: CameraMonitor[];
        southCameraMonitors: CameraMonitor[];
    };
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    refresh: Function;
}
export default defineComponent({
    components: { ElButtonGroup, ElButton },
    props: {
        odcInstance: {
            type: Object,
        },
    },
    setup(props) {
        const innerInstance: { value: OdcInstance } = ref({
            structure: {
                northCameraMonitors: [],
                southCameraMonitors: [],
            },
            camera: new THREE.PerspectiveCamera(),
            controls: new OrbitControls(
                new THREE.PerspectiveCamera(),
                new THREE.WebGLRenderer({ antialias: true }).domElement,
            ),
            refresh: () => {},
        });
        watch(
            () => props.odcInstance as OdcInstance,
            (newVal: OdcInstance) => {
                innerInstance.value = newVal;
            },
        );
        const handleClick = (index: number, area?: string) => {
            const currentCameraMonitor =
                area === SeatAreaType.north
                    ? innerInstance.value.structure.northCameraMonitors[index]
                    : innerInstance.value.structure.southCameraMonitors[index];
            currentCameraMonitor.observationArea({
                camera: innerInstance.value.camera,
                controls: innerInstance.value.controls,
            });
        };

        const refresh = () => {
            innerInstance.value.refresh();
        };

        // eslint-disable-next-line unicorn/consistent-function-scoping
        const handleMouseMove = (index: number, area?: string, option?: 0 | 1) => {
            const currentCameraMonitor =
                area === SeatAreaType.north
                    ? innerInstance.value.structure.northCameraMonitors[index]
                    : innerInstance.value.structure.southCameraMonitors[index];
            const hex = option === 0 ? 0xffffff : 0x409eff;
            currentCameraMonitor.setColor(hex);
            const scale = option === 0 ? 20 : 30;
            currentCameraMonitor.setScale(scale);
        };

        return {
            handleClick,
            handleMouseMove,
            refresh: refresh,
            seatAreaType: SeatAreaType,
        };
    },
});
</script>
<style scoped lang="scss">
.toolbar {
    position: absolute;
    bottom: 38px;
    left: 35%;
    transform: translateX(-50%);
}
</style>
