import {SeatInfo} from "@/scenes/odc/data/workstations-data";

export class StationInfo {
  private domId: string

    public constructor() {
        this.initContainer();
        this.initStyle();
    }
    private formatInfo(seatInfo: SeatInfo, type: string) {
        const empty = 'NA';
        return {
            pc: {
                label: '华为 PC 盒子 资产编号',
                value: seatInfo.pc || empty,
                highlight: type === 'pc',
            },
            macMini: {
                label: 'Mac Mini 资产编号',
                value: seatInfo.pc || empty,
                highlight: type === 'macMini',
            },
            monitor: {
                label: '显示器 资产编号',
                value: seatInfo.monitor,
                highlightIndex: type.includes('monitor') ? Number(type.split('.')[1]) : -1,
            },
            people: {
                label: '当前使用人',
                value: seatInfo.people || empty,
            },
        };
    }
    private initContainer() {
        this.domId = 'seatInfo';
        const container = document.createElement('div');
        container.id = this.domId;
        document.body.appendChild(container);
    }
    public show(seatData: StationInfo, type: string) {
        const seatInfo = this.formatInfo(seatData, type);
        const dom = `
			<div class="seat-info">
				<div class="info-block">
					<p class="info-block-label">${seatInfo.people.label}</p>
					<p class="info-block-value">${seatInfo.people.value}</p>
				</div>
				<div class="info-block">
					<p class="info-block-label">${seatInfo.pc.label}</p>
					<p class="info-block-value${seatInfo.pc.highlight ? ' highlight-value' : ''}">${
            seatInfo.pc.value
        }</p>
				</div>
				<div class="info-block">
					<p class="info-block-label">${seatInfo.macMini.label}</p>
					<p class="info-block-value${seatInfo.macMini.highlight ? ' highlight-value' : ''}">${
            seatInfo.macMini.value
        }</p>
				</div>
				<div class="info-block last">
					<p class="info-block-label">${seatInfo.monitor.label}</p>
					<p class="info-block-multiple-value">
						${seatInfo.monitor.value.map(
                            (item, idx) =>
                                `<span class="monitor-item${
                                    seatInfo.monitor.highlightIndex === idx
                                        ? ' highlight-value'
                                        : ''
                                }">${item}</span>`,
                        )}
					</p>
				</div>
			<div>
		`;
        document.getElementById(this.domId).innerHTML = dom;
        document.getElementById(this.domId).style.display = 'block';
    }
    public hide() {
        document.getElementById(this.domId).style.display = 'none';
    }
    privat initStyle() {
        this.styleId = 'seatInfoStyle';
        const styleContainer = document.createElement('style');
        styleContainer.id = this.styleId;
        const styleText = document.createTextNode(`
			.seat-info {
				width: 260px;
				position: absolute;
				color: #C0C4CC;
				top: 0px;
				right: 0px;
				padding: 10px;
				box-sizing: border-box;
				z-index: 1;
				background-color: rgba(0,0,0,0.8);
			}
			.seat-info .info-block:not(:last-child){
				border-bottom: 1px solid #303133;
			}
			.seat-info .info-block.last{
				border-bottom: none;
			}
			.info-block-label{
				font-size: 13px;
				color: #909399;
				margin: 6px 0 0 0;
			}
			.info-block-value, .info-block-multiple-value{
				font-size: 12px;
				margin: 2px 0 6px 0;
			}
			.seat-info .info-block.last .info-block-multiple-value{
				font-size: 12px;
				margin: 2px 0 2px 0;
			}
			.seat-info .highlight-value{
				color: #409EFF;
				font-size: 14px;
			}
		`);
        styleContainer.appendChild(styleText);
        document.head.appendChild(styleContainer);
    }
}
