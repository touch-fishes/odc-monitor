<template>
    <overview-info />
    <biz-group-info @seat-click="onSeatClick" />
    <monitor-toolbar
        @click-monitor-btn="onMonitorClick"
        @monitor-mouse-move="onMonitorMouseMove"
        @refresh="onRefresh"
    />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ElLoading } from 'element-plus';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';

import { loadODCResource, ODC } from '@/scenes/odc';
import BizGroupInfo from '@/views/biz-group-info/index.vue';
import OverviewInfo from '@/views/overview-info/index.vue';
import MonitorToolbar from '@/views/monitor-toolbar/index.vue';
import { SeatAreaType } from '@/data/workstations-data';

export default defineComponent({
    name: 'App',
    components: { BizGroupInfo, OverviewInfo, MonitorToolbar },
    setup() {
        let odc: undefined | ODC;
        const loading = ElLoading.service({
            lock: true,
            text: 'ODC Loading',
            background: 'rgba(0, 0, 0, 0.7)',
        });

        loadODCResource(() => loading.close()).then(() => {
            odc = new ODC();
        });
        const onSeatClick = (code: string) => {
            if (odc) {
                odc.lightSeat([code]);
            }
        };
        const getCurrentCameraMonitor = ({
            index,
            area,
        }: {
            index: number;
            area: SeatAreaType;
        }) => {
            return area === SeatAreaType.north
                ? odc?.getStructure().getMonitors().north[index]
                : odc?.getStructure().getMonitors().south[index];
        };
        const onMonitorClick = ({ index, area }: { index: number; area: SeatAreaType }) => {
            const currentCameraMonitor = getCurrentCameraMonitor({ index, area });
            currentCameraMonitor?.observationArea({
                camera: odc?.getCamera() as THREE.PerspectiveCamera,
                controls: odc?.getControls() as OrbitControls,
            });
        };
        const onMonitorMouseMove = ({
            index,
            area,
            option,
        }: {
            index: number;
            area: SeatAreaType;
            option: number;
        }) => {
            const currentCameraMonitor = getCurrentCameraMonitor({ index, area });
            const hex = option === 0 ? 0xffffff : 0x459eef;
            currentCameraMonitor?.setColor(hex);
            const scale = option === 0 ? 30 : 40;
            currentCameraMonitor?.setScale(scale);
        };
        const onRefresh = () => {
            odc?.refresh();
        };
        return {
            onSeatClick,
            onMonitorClick,
            onMonitorMouseMove,
            onRefresh,
        };
    },
});
</script>
