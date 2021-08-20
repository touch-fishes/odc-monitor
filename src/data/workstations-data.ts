import { ModelLine } from '@/scenes/types';

const sideSpacing = 1200;

export enum SeatAreaType {
    north = 'north',
    south = 'south',
}

export interface SeatInfo {
    code: string;
    rowCode: string;
    monitor: string[];
    macMini: string;
    pc: string;
}

export type AreaSeats = SeatInfo[][];

/**
 * 北部工位区域
 * */
export const northWorkstationArea: ModelLine = {
    begin: [120, 8400],
    end: [8400 - sideSpacing, 48000],
};

/**
 * 南部工位区域
 * @type {{end: number[], begin: number[]}}
 */
export const southWorkstationArea: ModelLine = {
    begin: [16800 + sideSpacing, 26800],
    end: [25200, 66000],
};

const generateWorkstationData = (row: number, type: SeatAreaType): AreaSeats => {
    const result = [];
    const pre = type === SeatAreaType.north ? '2900' : '2800';
    const areaCode = type === SeatAreaType.north ? 'n' : 's';
    const rowCode = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'];
    for (let i = 0; i < row; i++) {
        const currentRow = [];
        for (let j = 0; j < 10; j++) {
            currentRow.push({
                code: `${areaCode}${rowCode[i]}${j}`,
                rowCode: `${areaCode}${rowCode[i]}`,
                monitor: [`${pre}6${i}${j}${j}`, `${pre}6${i + 1}${j + 1}${j + 1}`],
                macMini: `${pre}3${i}${j}${j}`,
                pc: `${pre}2${i}${j}${j}`,
            });
        }
        result.push(currentRow);
    }
    return result;
};
/**
 * 北区的座位，从门开始算第一排
 * @type {*[]}
 */

export const northWorkstation = generateWorkstationData(10, SeatAreaType.north);

/**
 * 南区的座位，从门开始算第一排
 * @type {*[]}
 */
export const southWorkstation = generateWorkstationData(9, SeatAreaType.south);

export const odcInfo = {
    totalSeat: 190,
    useSeat: 80,
};

export const bizGroupInfo = [
    {
        code: 'E-commerce Frontend',
        seats: ['sa1', 'sa5', 'sb9'],
    },
    {
        code: 'Car Network',
        seats: ['sc1', 'sc2', 'sc3', 'sc4', 'sc5', 'sc6', 'sc7', 'sc8', 'sc9', 'sd6'],
    },
    {
        code: 'Low Code',
        seats: ['se1', 'se2', 'se3', 'se4', 'se5', 'se6', 'se7'],
    },
    {
        code: 'E-commerce Backend',
        seats: ['sf1', 'sf2', 'sf3', 'sf4', 'sf5', 'sf6', 'sf7'],
    },
    {
        code: 'Express',
        seats: ['sg1', 'sg2', 'sg3', 'sg4', 'sg5', 'sg6', 'sg7'],
    },
    {
        code: 'IT Security',
        seats: ['sj1', 'sj5', 'sj9'],
    },
];
