<template>
    <o-panel v-if="visible" class="info-container" :title="`工位信息-${data.code}`">
        <div class="user">
            <p class="label">使用者</p>
            <p class="value">{{ data.user }}</p>
        </div>
        <div class="macmini">
            <p class="label">Mac Mini</p>
            <p class="value">{{ data.macMini }}</p>
        </div>
        <div class="pc">
            <p class="label">PC</p>
            <p class="value">{{ data.pc }}</p>
        </div>
        <div class="monitor">
            <p class="label">显示器</p>
            <p class="value">{{ data.monitor.join(',') }}</p>
        </div>
        <el-button plain class="button" size="mini" @click.stop="onClose">关闭</el-button>
    </o-panel>
</template>

<script lang="ts">
// eslint-disable-next-line import/named
import { defineComponent, PropType } from 'vue';
import { ElButton } from 'element-plus';

import OPanel from '@/components/panel/index.vue';
import { SeatInfo } from '@/data/workstations-data';

export default defineComponent({
    components: { OPanel, ElButton },
    props: {
        visible: {
            required: true,
            type: Boolean as PropType<boolean>,
        },
        data: {
            required: true,
            type: Object as PropType<SeatInfo>,
        },
    },
    emits: ['close'],
    setup(_props, ctx) {
        return {
            onClose: () => ctx.emit('close'),
        };
    },
});
</script>
<style scoped lang="scss">
.info-container {
    right: 310px;
    top: 66px;
    width: 260px;
    background: #1e5e8e;
    border: 1px solid #0f375a;
    border-radius: 8px;
    text-align: center;
    .label {
        width: 30%;
        display: inline-block;
        text-align: left;
    }
    .value {
        text-align: right;
        width: 70%;
        display: inline-block;
    }
    .button {
        margin: 16px auto 0px;
    }
}
</style>
