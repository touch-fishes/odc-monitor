<template>
    <seat-info />
    <overview-info />
    <biz-group-info />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { loadODCResource, ODC } from '@/scenes/odc/odc';
import SeatInfo from '@/views/seat-info/index.vue';
import BizGroupInfo from '@/views/biz-group-info/index.vue';
import OverviewInfo from '@/views/overview-info/index.vue';

export default defineComponent({
    name: 'App',
    components: { SeatInfo, BizGroupInfo, OverviewInfo },
    setup() {
        loadODCResource().then(() => {
            // eslint-disable-next-line no-new
            new ODC();
        });
    },
});
</script>
