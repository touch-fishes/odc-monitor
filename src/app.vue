<template>
    <overview-info />
    <biz-group-info @seat-click="onSeatClick" />
    <monitor-toolbar />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ElLoading } from 'element-plus';

import { loadODCResource, ODC } from '@/scenes/odc';
import BizGroupInfo from '@/views/biz-group-info/index.vue';
import OverviewInfo from '@/views/overview-info/index.vue';
import MonitorToolbar from '@/views/monitor-toolbar/index.vue';

export default defineComponent({
    name: 'App',
    components: { BizGroupInfo, OverviewInfo, MonitorToolbar },
    setup() {
        let odc: undefined | ODC;
        const loading = ElLoading.service({
            lock: true,
            text: 'Loading',
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
        return {
            onSeatClick,
        };
    },
});
</script>
