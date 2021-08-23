import { SeatAreaType } from '@/data/workstations-data';

export const ObserveAreaOpts = [
    {
        label: '重置',
        type: 'refresh',
    },
    {
        label: '北1观测点',
        type: 'monitor',
        observeIndex: 0,
        areaType: SeatAreaType.north,
    },
    {
        label: '北2观测点',
        type: 'monitor',
        observeIndex: 1,
        areaType: SeatAreaType.north,
    },
    {
        label: '北3观测点',
        type: 'monitor',
        observeIndex: 2,
        areaType: SeatAreaType.north,
    },
    {
        label: '北4观测点',
        type: 'monitor',
        observeIndex: 3,
        areaType: SeatAreaType.north,
    },
    {
        label: '南1观测点',
        type: 'monitor',
        observeIndex: 0,
        areaType: SeatAreaType.south,
    },

    {
        label: '南2观测点',
        type: 'monitor',
        observeIndex: 1,
        areaType: SeatAreaType.south,
    },
    {
        label: '南3观测点',
        type: 'monitor',
        observeIndex: 2,
        areaType: SeatAreaType.south,
    },
];
