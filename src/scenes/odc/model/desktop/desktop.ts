import * as THREE from 'three';

import { HWHost } from '../computer-host/hw-host';
import { AppleHost } from '../computer-host/apple-host';
// @ts-ignore
import { generateTextSprite } from '../../util/generate-text-sprite.js';
import { getDefinedObject3D, getSize, setEqualScale } from '../../util/object-3d';
import { Monitor } from '../monitor/monitor';

import { SeatInfo } from '@/scenes/odc/data/workstations-data';

export class Desktop extends THREE.Group {
    public static clazzName = 'desktop';

    private readonly monitors: Monitor[];
    private monitorTips: THREE.Sprite[];
    private readonly pc: HWHost;
    private readonly pcTip: THREE.Sprite;
    private readonly macMini: AppleHost;
    private readonly macMiniTip: THREE.Sprite;

    public constructor(name: string, seatInfo: SeatInfo) {
        super();
        this.monitors = [];
        this.monitorTips = [];
        // 稳定性标识用于识别 当前 Group
        this.userData.clazzName = Desktop.clazzName;
        const { monitors, monitorTips } = this.createMonitor(name, seatInfo);
        this.monitors.push(...monitors);
        this.monitorTips.push(...monitorTips);
        const { macMini, macMiniTip } = this.createMacMini(name, seatInfo);
        const { pc, pcTip } = this.createPC(name, seatInfo);
        this.pc = pc;
        this.pcTip = pcTip;
        this.macMini = macMini;
        this.macMiniTip = macMiniTip;
        this.add(this.pc);
        this.add(this.pcTip);
        this.add(this.macMini);
        this.add(this.macMiniTip);
        this.monitors.forEach((monitor) => this.add(monitor));
        this.monitorTips.forEach((monitorTip) => this.add(monitorTip));
    }

    public active(activeMesh: THREE.Mesh) {
        const member = getDefinedObject3D(activeMesh);
        const clazzName = member?.userData.clazzName;
        if (clazzName === Monitor.clazzName) {
            // 有两个屏幕不好定位
            (member as Monitor).active();
            const index = member?.userData.index;
            this.monitorTips[index].material.visible = true;
        }
        if (clazzName === AppleHost.clazzName) {
            this.macMiniTip.material.visible = true;
            this.macMini.active();
        }
        if (clazzName === HWHost.clazzName) {
            this.pcTip.material.visible = true;
            this.pc.active();
        }
    }

    public silence() {
        this.pc.silence();
        this.macMini.silence();
        this.monitors.forEach((monitor) => {
            monitor.silence();
        });
        this.pcTip.material.visible = false;
        this.macMiniTip.material.visible = false;
        this.monitorTips.forEach((object3D) => {
            object3D.material.visible = false;
        });
    }

    private createMonitor(name: string, seatInfo: SeatInfo) {
        const monitors = [];
        const monitorTips = [];
        const theMonitorObj = new Monitor();
        if (!Array.isArray(seatInfo.monitor)) return { monitors: [], monitorTips: [] };
        for (let i = 0; i < seatInfo.monitor.length; i++) {
            const monitorObj = theMonitorObj.clone();
            monitorObj.rotation.y = -Math.PI;
            monitorObj.position.z = i * 40;
            monitorObj.name = `${name}_monitor_${i}`;
            monitorObj.userData.highlight = true;
            monitorObj.userData.type = `monitor.${i}`;
            monitorObj.userData.index = i;
            monitorObj.userData.data = seatInfo;
            const monitorTip = this.createTextSprite(seatInfo.monitor[i]);
            const { y, z } = getSize(monitorObj);
            monitorTip.position.y = y + 3;
            monitorTip.position.z = monitorObj.position.z + z / 2;
            monitorTip.material.visible = false;
            monitors.push(monitorObj);
            monitorTips.push(monitorTip);
        }
        return { monitors, monitorTips };
    }
    private createPC(name: string, info: SeatInfo) {
        const hwHost = new HWHost();
        const { y, z } = getSize(hwHost);
        hwHost.position.z = -z - 1;
        hwHost.position.y = y / 2;
        hwHost.name = `${name}_pc`;
        hwHost.userData.highlight = true;
        hwHost.userData.type = 'pc';
        hwHost.userData.data = info;
        // hwHost.userData.materials = hwHost.children[0].material;
        const hwTip = this.createTextSprite(info.pc);
        hwTip.position.y = y + 3;
        hwTip.position.z = hwHost.position.z;
        hwTip.material.visible = false;
        return {
            pc: hwHost,
            pcTip: hwTip,
        };
    }
    private createMacMini(name: string, info: SeatInfo) {
        const macMini = new AppleHost();
        const { y } = getSize(macMini);
        // macMini 放在显示器右边
        const { z: monitorZ } = getSize(this.monitors[0]);

        macMini.position.z = monitorZ * 2 + 1;
        macMini.position.y = y / 2;
        macMini.name = `${name}_macMini`;
        macMini.userData.highlight = true;
        macMini.userData.type = 'macMini';
        macMini.userData.data = info;
        // macMini.userData.materials = macMini.children[0].material;
        const macMiniTip = this.createTextSprite(info.macMini);
        const { x: tipX } = getSize(macMiniTip);
        macMiniTip.position.y = y + 3;
        macMiniTip.position.z = macMini.position.z + tipX / 3;
        macMiniTip.material.visible = false;
        return {
            macMini: macMini,
            macMiniTip: macMiniTip,
        };
    }
    private createTextSprite(text: string) {
        const textSprite = generateTextSprite(text || '', {
            fontFace: 'Helvetica',
            fontSize: 36,
            fontColor: 'rgba(255, 255, 255, 1)',
            fontBold: false,
            fontItalic: false,
            textAlign: 'center',
            borderThickness: 3,
            borderColor: 'rgba(50, 50, 255, 0.8)',
            borderRadius: 6,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
        });
        setEqualScale(textSprite, 0.1);
        return textSprite as THREE.Sprite;
    }
}
