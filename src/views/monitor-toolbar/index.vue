<template>
    <el-button-group class="toolbar">
        <el-button type="primary" icon="el-icon-view"></el-button>
        <el-button type="primary" icon="el-icon-view"></el-button>
        <el-button type="primary" icon="el-icon-view"></el-button>
        <el-button type="primary" icon="el-icon-view"></el-button>
        <el-button type="primary" icon="el-icon-view"></el-button>
        <el-button type="primary" icon="el-icon-view"></el-button>
        <el-button type="primary" icon="el-icon-view"></el-button>
    </el-button-group>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ElButton, ElButtonGroup } from 'element-plus';

export default defineComponent({
    components: { ElButtonGroup, ElButton },
    setup() {},
});
</script>
<style scoped lang="scss">
.toolbar {
    position: absolute;
    bottom: 38px;
    left: 50%;
    transform: translateX(-50%);
}
</style>
