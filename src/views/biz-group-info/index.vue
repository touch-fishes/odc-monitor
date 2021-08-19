<template>
    <o-panel class="info-container" title="项目组信息">
        <div class="group-container">
            <div v-for="group in groups" :key="group.code" class="groups">
                <div class="group-item">
                    <p class="group-base-info">
                        <span class="group-name"> {{ group.code }}</span>
                        <span class="people-count">{{ group.seats.length }}</span>
                    </p>
                    <p class="group-seat">
                        <el-tag
                            v-for="item in group.seats"
                            :key="item"
                            class="seat-tag"
                            size="mini"
                            effect="dark"
                        >
                            {{ item.toUpperCase() }}
                        </el-tag>
                    </p>
                </div>
            </div>
        </div>
    </o-panel>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ElTag } from 'element-plus';

import OPanel from '@/components/panel/index.vue';
import { odcInfo, bizGroupInfo } from '@/data/workstations-data';

export default defineComponent({
    components: { OPanel, ElTag },
    setup() {
        return {
            groups: bizGroupInfo,
            useSeat: odcInfo.useSeat,
            totalSeat: odcInfo.totalSeat,
            usageRate: Math.ceil((odcInfo.useSeat / odcInfo.totalSeat) * 100),
        };
    },
});
</script>
<style scoped lang="scss">
.info-container {
    left: 0;
    top: 66px;
    max-height: calc(100% - 66px);
    overflow: hidden;
    width: 280px;
    .group-container {
        max-height: calc(100% - 100px);
        .groups {
            .group-item {
                text-align: left;
                margin: 2px 0;
                .group-base-info {
                    margin: 0;
                    overflow: auto;
                    .group-name {
                        float: left;
                        display: block;
                        width: 180px;
                    }
                    .people-count {
                        display: block;
                        float: right;
                        font-weight: 600;
                        color: #409eff;
                    }
                }
                .seat-tag {
                    cursor: pointer;
                    margin: 2px 2px;
                }
            }
        }
    }
}
</style>
