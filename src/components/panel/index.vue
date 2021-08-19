<template>
    <el-card class="card-define" shadow="hover">
        <template #header>
            <div class="card-header">
                <span>{{ theTitle }}</span>
            </div>
        </template>
        <div v-for="o in 4" :key="o" class="text item">
            {{ '列表内容 ' + o }}
        </div>
    </el-card>
</template>

<script lang="ts">
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
    width: 280px;
}
</style>
