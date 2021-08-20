import { ModelLine } from '@/scenes/types';

const sideSpacing = 1200;

export enum SeatAreaType {
    north = 'north',
    south = 'south',
}

export interface SeatInfo {
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
    for (let i = 0; i < row; i++) {
        const currentRow = [];
        for (let j = 0; j < 10; j++) {
            currentRow.push({
                rowCode: `${type}-station-row-${i}`,
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
        seats: ['a1', 'a5', 'b9'],
    },
    {
        code: 'Car Network',
        seats: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'd6'],
    },
    {
        code: 'Low Code',
        seats: ['e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7'],
    },
    {
        code: 'E-commerce Backend',
        seats: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7'],
    },
    {
        code: 'Express',
        seats: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7'],
    },
    {
        code: 'IT Security',
        seats: ['j1', 'j5', 'j9'],
    },
];
