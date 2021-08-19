export const southCameraMonitors = [
    {
        begin: [14400, 32800],
        end: [20000, 35200],
        observedSeatRowIndex: 1,
    },
    {
        begin: [14400, 46000],
        end: [20000, 48400],
        observedSeatRowIndex: 4,
    },
    {
        begin: [14400, 59200],
        end: [20000, 61600],
        observedSeatRowIndex: 7,
    },
];

export const northCameraMonitors = [
    {
        begin: [7600, 14200],
        end: [7600, 16600],
        observedSeatRowIndex: 1,
    },
    {
        begin: [7600, 26800],
        end: [7600, 27800],
        observedSeatRowIndex: 4,
    },
    {
        begin: [7600, 38800],
        end: [7600, 39400],
        observedSeatRowIndex: 7,
    },
    {
        begin: [7600, 44600],
        end: [7600, 46200],
        observedSeatRowIndex: 9,
    },
];

export interface CameraMonitorItem {
    begin: number[];
    end: number[];
    observedSeatRowIndex: number;
}
