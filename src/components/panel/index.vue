<template>
    <el-card class="card-define" shadow="hover">
        <template #header>
            <div class="card-header">
                <span>{{ theTitle }}</span>
            </div>
        </template>
        <slot></slot>
    </el-card>
</template>

<script lang="ts">
// eslint-disable-next-line import/named
import { defineComponent, PropType } from 'vue';
import { ElCard } from 'element-plus';

export default defineComponent({
    name: 'App',
    components: { ElCard },
    props: {
        title: {
            required: true,
            type: String as PropType<string>,
        },
    },
    setup(props) {
        return { theTitle: props.title };
    },
});
</script>
<style lang="scss" scoped>
.card-define {
    position: absolute;
    max-width: 300px;
    .card-header {
        font-size: 15px;
        font-weight: 600;
    }
}
</style>
