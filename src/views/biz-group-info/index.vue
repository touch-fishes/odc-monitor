<template>
    <o-panel class="seat-info" title="项目组"></o-panel>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import OPanel from '@/components/panel/index.vue';

export default defineComponent({
    components: { OPanel },
    setup() {},
});
</script>
<style scoped lang="scss">
.seat-info {
    left: 0;
    top: 300px;
}
</style>
