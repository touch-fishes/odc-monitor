import { ModelPointer } from '@/scenes/types';

export const clientX2X = (clientX: number) => {
    return (clientX / window.innerWidth) * 2 - 1;
};

export const clientY2Y = (clientY: number) => {
    return -(clientY / window.innerHeight) * 2 + 1;
};

export const scale = (measurement: number) => {
    // ODC 长 71米
    const measurementLength = 71200;
    const viewLength = 1600;
    return (measurement * viewLength) / measurementLength;
};

export const getCenterOfModelArea = (begin: ModelPointer, end: ModelPointer) => {
    const [beginX, beginY] = begin.map((element) => scale(element));
    const [endX, endY] = end.map((element) => scale(element));
    // 模型的 x 对应 坐标系 z 轴
    const centerZ = (beginX + endX) / 2;
    // 模型的 y 对应 坐标系 x 轴
    const centerX = (beginY + endY) / 2;
    return { x: centerX, z: centerZ };
};
