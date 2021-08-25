<template>
    <overview-info />
    <biz-group-info @seat-click="onSeatClick" />
    <seat-info
        :visible="seatInfo.visible"
        :data="seatInfo.data"
        @close="seatInfo.visible = false"
    />
    <monitor-toolbar
        @click-monitor-btn="onMonitorClick"
        @monitor-mouse-move="onMonitorMouseMove"
        @refresh="onRefresh"
    />
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { ElLoading } from 'element-plus';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';

import { EventType, loadODCResource, ODC } from '@/scenes/odc';
import BizGroupInfo from '@/views/biz-group-info/index.vue';
import OverviewInfo from '@/views/overview-info/index.vue';
import MonitorToolbar from '@/views/monitor-toolbar/index.vue';
import SeatInfo from '@/views/seat-info/index.vue';
import { SeatAreaType, SeatInfo as SeatDataInfo } from '@/data/workstations-data';

export default defineComponent({
    name: 'App',
    components: { BizGroupInfo, OverviewInfo, MonitorToolbar, SeatInfo },
    setup() {
        let odc: undefined | ODC;
        const seatInfo = reactive<{ data: SeatDataInfo | undefined; visible: boolean }>({
            data: undefined,
            visible: false,
        });
        const loading = ElLoading.service({
            lock: true,
            text: 'ODC Loading',
            background: 'rgba(0, 0, 0, 0.7)',
        });
        const showSeatInfoHandler = (seatDataInfo: SeatDataInfo) => {
            seatInfo.data = seatDataInfo;
            seatInfo.visible = true;
        };
        loadODCResource(() => loading.close()).then(() => {
            odc = new ODC();
            odc.addEvent(EventType.showSeatInfo, showSeatInfoHandler);
        });

        return {
            onSeatClick: (code: string) => odc?.lightSeat([code]),
            onMonitorClick: ({ index, area }: { index: number; area: SeatAreaType }) =>
                odc?.activeCamera({ index, area }),
            onMonitorMouseMove: ({
                index,
                area,
                option,
            }: {
                index: number;
                area: SeatAreaType;
                option: number;
            }) =>
                odc?.highLightCamera({
                    index,
                    area,
                    option,
                }),
            onRefresh: () => odc?.refresh(),
            seatInfo,
        };
    },
});
</script>
