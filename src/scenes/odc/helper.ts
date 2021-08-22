import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';

export class Helper extends THREE.Group {
    public readonly stats: Stats;

    private readonly axesHelper: THREE.AxesHelper;
    private readonly gridHelper: THREE.GridHelper;
    public constructor() {
        super();
        // 坐标轴
        this.axesHelper = this.createAxesHelper();
        this.gridHelper = this.createGridHelper();
        this.stats = this.createStats();
        this.add(this.axesHelper);
        this.add(this.gridHelper);
    }

    private createStats() {
        // @ts-ignore
        const stats = new Stats();
        document.body.append(stats.dom);
        return stats;
    }

    private createAxesHelper() {
        const axesHelper = new THREE.AxesHelper(200);
        // 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
        axesHelper.position.set(0, 100, 0);
        return axesHelper;
    }
    private createGridHelper() {
        return new THREE.GridHelper(2000, 50);
    }
}
