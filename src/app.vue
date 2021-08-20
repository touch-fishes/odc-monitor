<template>
    <overview-info />
    <biz-group-info />
    <monitor-toolbar :odc-instance="odcInstance" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { ElLoading } from 'element-plus';

import { loadODCResource, ODC } from '@/scenes/odc';
import BizGroupInfo from '@/views/biz-group-info/index.vue';
import OverviewInfo from '@/views/overview-info/index.vue';
import MonitorToolbar from '@/views/monitor-toolbar/index.vue';

export default defineComponent({
    name: 'App',
    components: { BizGroupInfo, OverviewInfo, MonitorToolbar },
    setup() {
        const odcInstance = ref({});
        const loading = ElLoading.service({
            lock: true,
            text: 'Loading',
            background: 'rgba(0, 0, 0, 0.7)',
        });

        loadODCResource(() => loading.close()).then(() => {
            // eslint-disable-next-line no-new
            odcInstance.value = new ODC();
        });
      return {
        odcInstance: odcInstance,
      };
    },
});
</script>
