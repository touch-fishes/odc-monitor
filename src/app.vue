<template>
    <div></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { loadODCResource, ODC } from './scenes/odc/odc';

export default defineComponent({
    name: 'App',
    components: {},
    setup() {
        loadODCResource().then(() => {
            // eslint-disable-next-line no-new
            new ODC();
        });
    },
});
</script>
