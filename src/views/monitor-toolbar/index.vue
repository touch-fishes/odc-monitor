<template>
    <div class="toolbar">
        <el-dropdown>
            <el-button icon="el-icon-location">
                切换观测点<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item v-for="item in ObserveAreaOpts" :key="item">
                        <div
                            @click="
                                handleMenuItemClick(item.type, item?.observeIndex, item?.areaType)
                            "
                            @mouseenter="handleMouseMove(item?.observeIndex, item?.areaType)"
                            @mouseleave="handleMouseMove(item?.observeIndex, item?.areaType, 0)"
                        >
                            {{ item.label }}
                        </div>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus';

import { SeatAreaType } from '@/data/workstations-data';
import { ObserveAreaOpts } from '@/views/monitor-toolbar/const';

export default defineComponent({
    components: { ElDropdownMenu, ElButton, ElDropdownItem, ElDropdown },
    props: {
        odcInstance: {
            type: Object,
        },
    },
    emits: ['click-monitor-btn', 'monitor-mouse-move', 'refresh'],
    setup(props, context) {
        const handleMenuItemClick = (type: string, index: number, area: SeatAreaType) => {
            if (type === 'refresh') {
                context.emit('refresh');
            } else {
                context.emit('click-monitor-btn', { index, area });
            }
        };
        const handleMouseMove = (index: number, area?: string, option?: 0 | 1) => {
            context.emit('monitor-mouse-move', { index, area, option });
        };
        return {
            handleMenuItemClick,
            handleMouseMove,
            seatAreaType: SeatAreaType,
            ObserveAreaOpts: ObserveAreaOpts,
        };
    },
});
</script>
<style scoped lang="scss">
.toolbar {
    position: absolute;
    top: 66px;
    left: 20%;
    margin-left: 20px;
    transform: translateX(-50%);
}
.el-button {
    background: #2f6186;
    border: 1px solid #2f6186;
    &:hover,
    &:focus {
        background: #2f6186;
        border: 1px solid #5e98c6;
        color: #459eef;
    }
}

.el-dropdown-menu {
    position: relative;
    width: 150px;
    top: -10px;
    left: -20px;
    background: #2f6186;
    border: 1px solid #2f6186;
}
.el-dropdown-menu__item {
    &:hover {
        background-color: #2f6186 !important;
    }
}
</style>
