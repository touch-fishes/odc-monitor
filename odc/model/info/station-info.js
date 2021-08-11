export class StationInfo {
	constructor() {
		this.initContainer();
		this.initStyle();
		// // TODO 测试
		this.show({
			rowCode: 'h',
			people: 'Show Money King Rockefeller',
			monitor: ['29006360', '29006361'],
			macmini: '29006362',
			pc: '29006560'
		});
	}
	formatInfo(seatInfo) {
		const empty = 'NA';
		return {
			pc: {
				label: '华为 PC 盒子 资产编号',
				value: seatInfo.pc || empty
			},
			macmini: {
				label: 'Mac Mini 资产编号',
				value: seatInfo.pc || empty
			},
			monitor: {
				label: '显示器z 资产编号',
				value: seatInfo.monitor
			},
			people: {
				label: '当前使用人',
				value: seatInfo.people || empty
			}
		}
	}
	initContainer() {
		this.domId = 'seatInfo';
		const container = document.createElement('div')
		container.id = this.domId;
		document.body.appendChild(container)
	}
	show(seatData) {
		const seatInfo = this.formatInfo(seatData);
		const dom = `
			<div class="seat-info">
				<div class="info-block">
					<p class="info-block-label">${seatInfo.people.label}</p>
					<p class="info-block-value">${seatInfo.people.value}</p>
				</div>
				<div class="info-block">
					<p class="info-block-label">${seatInfo.pc.label}</p>
					<p class="info-block-value">${seatInfo.pc.value}</p>
				</div>
				<div class="info-block">
					<p class="info-block-label">${seatInfo.macmini.label}</p>
					<p class="info-block-value">${seatInfo.macmini.value}</p>
				</div>
				<div class="info-block last">
					<p class="info-block-label">${seatInfo.monitor.label}</p>
					<p class="info-block-multiple-value">${seatInfo.monitor.value.map((item) => `<span>${item}</span>`)}</p>
				</div>
			<div>
		`;
		document.getElementById(this.domId).innerHTML = dom;
	}
	initStyle() {
		this.styleId = 'seatInfoStyle';
		const styleContainer = document.createElement('style')
		styleContainer.id = this.styleId;
		const styleText = document.createTextNode(`
			.seat-info {
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
		`);
		styleContainer.appendChild(styleText);
		document.head.appendChild(styleContainer);
	}
}
