import * as THREE from 'three';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';

// import { StationInfo } from '../info/station-info';
import { Seat } from '../seat/seat';
import { getDefinedObject3D, getDefinedObject3DByName, getSize } from '../../util/object-3d';
import { MousemoveObserver } from '../../event/mousemove';
import { ClickObserver } from '../../event/click';
import { Desktop } from '../desktop/desktop';

import { AreaSeats, SeatInfo, SeatAreaType } from '@/data/workstations-data';

export class Workstation extends THREE.Group implements MousemoveObserver, ClickObserver {
    private activeDesktop: any;

    // eslint-disable-next-line max-params
    public constructor(
        {},
        { xLength, zLength }: { xLength: number; zLength: number },
        seats: AreaSeats,
        type: SeatAreaType,
    ) {
        super();
        // 初始化信息面板
        // this.seatInfoPlan = new StationInfo();
        const workstation = this.createWorkstation({ xLength, zLength }, seats, type);
        this.add(workstation);
    }

    // 暂时不需要在没有 hover 的时候做任何事情
    public beforeMousemove() {}

    public onMousemove(
        { highlightOutlinePass }: { highlightOutlinePass: OutlinePass },
        activeMesh: THREE.Mesh,
    ) {
        // 是不是可以进行高亮操作
        if (activeMesh?.parent?.userData.highlight) {
            highlightOutlinePass.selectedObjects = [activeMesh?.parent];
        }
    }

    public beforeClick() {
        // 清除上次高亮的设备
        if (this.activeDesktop) {
            this.activeDesktop.silence();
            this.activeDesktop = undefined;
            // this.seatInfoPlan.hide();
        }
    }

    public onClick(
        { highlightOutlinePass }: { highlightOutlinePass: OutlinePass },
        activeMesh: THREE.Mesh,
    ) {
        // 是不是可以进行高亮操作
        const definedObject3D = getDefinedObject3D(activeMesh);
        if (definedObject3D?.userData.highlight) {
            // 高亮当前的设备
            const desktop = getDefinedObject3DByName(activeMesh, Desktop.clazzName);
            if (desktop) {
                (desktop as Desktop).active(activeMesh);
                // 记录当前激活物
                this.activeDesktop = desktop;
            }
            // this.seatInfoPlan.show(definedObject3D.userData.data, definedObject3D.userData.type);
        }
    }

    public getMousemoveObserveObjects() {
        const allSeats: THREE.Object3D[] = [];
        this.children.forEach((innerGroup) => {
            innerGroup.children.forEach((row) => {
                row.children.forEach((seat) => {
                    allSeats.push(seat);
                });
            });
        });
        return allSeats;
    }

    // eslint-disable-next-line sonarjs/no-identical-functions
    public getClickObserveObjects() {
        const allSeats: THREE.Object3D[] = [];
        // eslint-disable-next-line sonarjs/no-identical-functions
        this.children.forEach((innerGroup) => {
            // eslint-disable-next-line sonarjs/no-identical-functions
            innerGroup.children.forEach((row) => {
                row.children.forEach((seat) => {
                    allSeats.push(seat);
                });
            });
        });
        return allSeats;
    }

    private createWorkstation(
        { xLength, zLength }: { xLength: number; zLength: number },
        seats: AreaSeats,
        type: SeatAreaType,
    ) {
        const spacing = xLength / seats.length;
        const xCenter = zLength / 2;
        const innerGroup = new THREE.Group();
        seats.forEach((row, idx) => {
            const seatGroup = this.createSeatGroup(row);
            seatGroup.name = `${type}_seatRow_${idx}`;
            // 排列位置
            seatGroup.position.z = xCenter;
            seatGroup.position.x = spacing * idx;
            innerGroup.add(seatGroup);
        });
        // 前面要留点空位置
        innerGroup.position.x = -xLength / 2 + 60;
        // TODO scale 计算错误
        innerGroup.position.z = -xCenter - 66;
        return innerGroup;
    }
    private createSeatGroup(rowSeats: SeatInfo[]) {
        // 按照南北 分为两排
        const seatsGroup = new THREE.Group();
        const seatsLength = rowSeats.length;
        // 背靠背两排的个数
        const itemNumber = seatsLength / 2;
        const tempSeat = new Seat(rowSeats[0]);
        const { x, z } = getSize(tempSeat.table);

        // 循环排列工位
        for (let i = 0; i < itemNumber; i++) {
            // 创建一个 工位
            const eastSeat = new Seat(rowSeats[i]);
            // 获取宽高信息计算排列
            const westSeat = new Seat(rowSeats[seatsLength - i - 1]);
            const offset = z * i;
            westSeat.position.z = offset;
            westSeat.position.x = 0;
            eastSeat.position.z = offset;
            // 东变的座位需要旋转下, 再移动桌子的距离
            eastSeat.rotation.y = -Math.PI;
            eastSeat.position.x = x;
            // 添加到分组中
            seatsGroup.add(westSeat);
            seatsGroup.add(eastSeat);
        }

        return seatsGroup;
    }
}
