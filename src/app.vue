<template>
    <overview-info />
    <biz-group-info />
    <monitor-toolbar />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { loadODCResource, ODC } from '@/scenes/odc/odc';
import BizGroupInfo from '@/views/biz-group-info/index.vue';
import OverviewInfo from '@/views/overview-info/index.vue';
import MonitorToolbar from '@/views/monitor-toolbar/index.vue';
import { CameraMonitorObj3D, CoffeeTableObj3D, KitchenObj3D, SofaObj3D } from '@/scenes/types';

type LoadRes = [CoffeeTableObj3D, SofaObj3D, KitchenObj3D, CameraMonitorObj3D, unknown, unknown];
export default defineComponent({
    name: 'App',
    components: { BizGroupInfo, OverviewInfo, MonitorToolbar },
    setup() {
        // 修改any
        loadODCResource().then(
            ([coffeeTableObj3D, sofaObj3D, kitchenObj3D, cameraMonitorObj3D]: LoadRes) => {
                // eslint-disable-next-line no-new
                new ODC({
                    coffeeTableObj3D,
                    sofaObj3D,
                    kitchenObj3D,
                    cameraMonitorObj3D,
                });
            },
        );
    },
});
</script>
