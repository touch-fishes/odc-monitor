const sideSpacing = 1200;

/**
 * 北部工位区域
 * */
export const northWorkstationArea = {
	begin: [sideSpacing, 8400],
	end: [8400, 48000],
}

/**
 * 南部工位区域
 * @type {{end: number[], begin: number[]}}
 */
export const southWorkstationArea = {
	begin: [16800 + sideSpacing, 26800],
	end: [25200, 66000]
};


const generateWorkstationData = (row, type) => {
	const result = [];
	const pre = type === 'north' ? '2900' : '2800';
	for(let i=0; i<row; i++) {
		const currentRow = [];
		for(let j=0; j<10; j++) {
			currentRow.push({
				rowCode: `${type}-station-row-${i}`,
				monitor: [`${pre}6${i}${j}${j}`, `${pre}6${i+1}${j+1}${j+1}`],
				macmini: `${pre}3${i}${j}${j}`,
				pc: `${pre}2${i}${j}${j}`,
			})
		}
		result.push(currentRow)
	}
	return result;
}
/**
 * 北区的座位，从门开始算第一排
 * @type {*[]}
 */

export const northWorkstation = generateWorkstationData(10, 'north');

/**
 * 南区的座位，从门开始算第一排
 * @type {*[]}
 */
export const southWorkstation = generateWorkstationData(9, 'south');
