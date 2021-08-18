<template>
    <seatInfo />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { loadODCResource, ODC } from '@/scenes/odc/odc';
import SeatInfo from '@/views/seat-info/index.vue';

export default defineComponent({
    name: 'App',
    components: { SeatInfo },
    setup() {
        loadODCResource().then(() => {
            // eslint-disable-next-line no-new
            new ODC();
        });
    },
});
</script>
