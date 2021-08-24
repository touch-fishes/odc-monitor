<template>
    <o-panel class="info-container" title="ODC 概况">
        <div class="content">
            <div class="overview-box">
                <el-progress
                    class="odc-progress"
                    :stroke-width="12"
                    type="circle"
                    :percentage="usageRate"
                    color="#459eff"
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

            <div class="devices-box">
                <div v-for="item in devicesInfo" :key="item.type" class="device-box">
                    <div class="device-label">
                        <apple v-if="item.type === 'macmini'" class="icon" />
                        <monitor v-if="item.type === 'screen'" class="icon" />
                        <wallet v-if="item.type === 'pc'" class="icon" />
                        <span>{{ item.title }}</span>
                    </div>
                    <div class="device-info">
                        <span class="device-number">
                            {{ item.data.usage }}/{{ item.data.total }}
                        </span>
                        <el-progress
                            class="device-progress"
                            :stroke-width="uiConfig.deviceStrokeWidth"
                            :width="uiConfig.deviceProgressWidth"
                            :show-text="false"
                            color="#459eff"
                            type="circle"
                            :percentage="item.data.usageRate"
                        />
                    </div>
                </div>
            </div>
        </div>
    </o-panel>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ElProgress } from 'element-plus';
import { Apple, Monitor, Wallet } from '@element-plus/icons';

import OPanel from '@/components/panel/index.vue';
import { odcInfo, bizGroupInfo, getMacMini, getScreen, getPC } from '@/data/workstations-data';

const uiConfig = {
    deviceStrokeWidth: 3,
    deviceProgressWidth: 32,
};

export default defineComponent({
    components: { OPanel, ElProgress, Apple, Monitor, Wallet },
    setup() {
        const devicesInfo = [
            {
                type: 'screen',
                title: '显示器',
                data: getScreen(),
            },
            {
                type: 'macmini',
                title: 'Mac Mini',
                data: getMacMini(),
            },
            {
                type: 'pc',
                title: 'PC',
                data: getPC(),
            },
        ];
        return {
            uiConfig: uiConfig,
            groups: bizGroupInfo,
            useSeat: odcInfo.useSeat,
            totalSeat: odcInfo.totalSeat,
            usageRate: Math.ceil((odcInfo.useSeat / odcInfo.totalSeat) * 100),
            devicesInfo,
        };
    },
});
</script>
<style scoped lang="scss">
.icon {
    width: 1em;
    height: 1em;
    margin-right: 6px;
    position: relative;
    top: 2px;
}
.info-container {
    right: 20px;
    top: 66px;
    max-height: calc(100% - 66px);
    overflow: hidden;
    width: 280px;
    background: transparent;
    border: 1px solid #0f375a;
    border-radius: 8px;
    .panel-split {
        margin: 18px 0 8px 0;
        text-align: left;
        font-size: 15px;
    }
    .content {
        text-align: center;
        .overview-box {
            padding: 18px 16px;
            border-radius: 6px;
            background: #1e5e8e;

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
                        color: #afe5f3;
                    }
                    .value-use {
                        font-size: 18px;
                        font-weight: 600;
                        color: #459eff;
                        float: right;
                    }
                    .value-no-use {
                        font-size: 18px;
                        font-weight: 600;
                        float: right;
                        color: #ffffff;
                    }
                }
            }
        }

        .devices-box {
            .device-box {
                height: 80px;
                text-align: left;
                overflow: hidden;
                margin: 12px 0;
                background: #1e5e8e;
                padding: 0 16px;
                border-radius: 6px;
                .device-label {
                    line-height: 80px;
                    display: inline-block;
                    width: 42%;
                    font-size: 15px;
                    float: left;
                }
                .device-info {
                    line-height: 80px;
                    width: 58%;
                    display: inline-block;
                    float: left;
                    position: relative;
                    text-align: right;
                    .device-number {
                        text-align: right;
                        display: inline-block;
                        font-size: 18px;
                        color: #ffffff;
                        font-weight: 600;
                        padding-right: 50px;
                    }
                    .device-progress {
                        display: inline-block;
                        position: absolute;
                        top: 50%;
                        right: 0;
                        transform: translateY(-50%);
                    }
                }
            }
        }
    }
}
</style>
