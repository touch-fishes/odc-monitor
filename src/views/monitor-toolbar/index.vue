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

import { SeatAreaType } from '@/data/workstations-data';

export default defineComponent({
    components: { ElButtonGroup, ElButton },
    props: {
        odcInstance: {
            type: Object,
        },
    },
    emits: ['click-monitor-btn', 'monitor-mouse-move', 'refresh'],
    setup(props, context) {
        const handleClick = (index: number, area?: string) => {
            context.emit('click-monitor-btn', { index, area });
        };

        const refresh = () => {
            context.emit('refresh');
        };
        const handleMouseMove = (index: number, area?: string, option?: 0 | 1) => {
            context.emit('monitor-mouse-move', { index, area, option });
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
