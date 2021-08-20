<template>
    <o-panel class="info-container" title="ODC 概况">
        <div class="content">
            <el-progress
                class="odc-progress"
                :stroke-width="12"
                type="circle"
                :percentage="usageRate"
            >
                <template #default="{ percentage }">
                    <span class="percentage-value">{{ percentage }}%</span>
                    <span class="percentage-label">工位使用率</span>
                </template>
            </el-progress>
            <div class="progress-info">
                <p class="progress-info-item">
                    <span class="label">使用中工位</span
                    ><span class="value-use">{{ useSeat }}</span>
                </p>
                <p class="progress-info-item">
                    <span class="label">未使用中工位</span
                    ><span class="value-no-use">{{ totalSeat - useSeat }}</span>
                </p>
            </div>
        </div>
    </o-panel>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ElProgress } from 'element-plus';

import OPanel from '@/components/panel/index.vue';
import { odcInfo, bizGroupInfo } from '@/data/workstations-data';

export default defineComponent({
    components: { OPanel, ElProgress },
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
    right: 0;
    top: 66px;
    max-height: calc(100% - 66px);
    overflow: hidden;
    width: 280px;
    .panel-split {
        margin: 18px 0 8px 0;
        text-align: left;
        font-size: 15px;
    }
    .content {
        text-align: center;
        .odc-progress {
            .percentage-value {
                display: block;
                font-size: 28px;
            }
            .percentage-label {
                display: block;
                margin-top: 10px;
                font-size: 12px;
                color: #a1a1a6;
            }
        }
        .progress-info {
            .progress-info-item {
                margin: 5px 0;
                text-align: left;
                overflow: auto;
                .label {
                    margin-right: 20px;
                }
                .value-use {
                    font-size: 16px;
                    font-weight: 600;
                    color: #409eff;
                    float: right;
                }
                .value-no-use {
                    font-size: 16px;
                    font-weight: 600;
                    float: right;
                    color: #ffffff;
                }
            }
        }
    }
}
</style>
