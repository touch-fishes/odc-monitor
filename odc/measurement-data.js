/**
 * 墙的高度
 * @type {number}
 */
export const WALL_HEIGHT = 4200;
/**
 * 墙的厚度
 * @type {number}
 */
export const WALL_THICKNESS = 200;
/**
 * 地面参数
 * @type {{end: number[], begin: number[]}}
 */
export const floor = {
	begin: [0, 0],
	end: [25200, 71200]
};
/**
 * 以西北方为(0,0)坐标,x 轴为 北南 轴， y 为 西东 轴
 * @type {({end: number[], type: string, begin: number[]}|{end: number[], type: string, begin: number[]}|{end: number[], type: string, begin: number[]}|{end: number[], type: string, begin: number[]}|{end: number[], type: string, begin: number[]})[]}
 */
export const walls = [
	// 外墙
	{
		type: 'external',
		begin: [0, 0],
		end: [0, 71200]
	},
	{
		type: 'external',
		begin: [25200, 0],
		end: [25200, 71200]
	},
	{
		type: 'external',
		begin: [0, 0],
		end: [25200, 0]
	},
	{
		type: 'external',
		begin: [0, 71200],
		end: [25200, 71200]
	},
	// 入户区域
	{
		type: 'glass',
		begin: [8400, 0],
		end: [8400, 8400]
	},
	{
		type: 'inner',
		begin: [0, 8400],
		end: [8400, 8400]
	},
	// 柜体区域
	{
		type: 'inner',
		begin: [8400, 8400],
		end: [8400, 12600]
	},
	{
		type: 'inner',
		begin: [8400, 12600],
		end: [14400, 16800]
	},
	// ODC 外卫生间区域
	{
		type: 'inner',
		begin: [16800, 0],
		end: [16800, 8400]
	},
	{
		type: 'inner',
		begin: [16800, 8400],
		end: [25200, 8400]
	},
	// ODC 外会议室区域
	{
		type: 'inner',
		begin: [16800, 14400],
		end: [16800, 21600]
	},
	{
		type: 'glass',
		begin: [16800, 14400],
		end: [25200, 14400]
	},
	{
		type: 'inner',
		begin: [16800, 21600],
		end: [25200, 21600]
	},
	// ODC 中间隔断的大墙
	{
		type: 'inner',
		begin: [14400, 16800],
		end: [14400, 36000]
	},
	{
		type: 'inner',
		begin: [14400, 36000],
		end: [8400, 42000]
	},
	{
		type: 'inner',
		begin: [8400, 45600],
		end: [8400, 49200]
	},
	// 会议室区域离墙
	{
		type: 'glass',
		begin: [16800, 49200],
		end: [16800, 64800]
	},
	{
		type: 'inner',
		begin: [10800, 49200],
		end: [10800, 64800]
	},
	{
		type: 'glass',
		begin: [10800, 49200],
		end: [16800, 49200]
	},
	{
		type: 'inner',
		begin: [10800, 64800],
		end: [16800, 64800]
	},
	// 内部厕所走道墙
	{
		type: 'inner',
		begin: [0, 49200],
		end: [8400, 49200]
	},
	// 尾部会议室
	{
		type: 'glass',
		begin: [14400, 68000],
		end: [25200, 66000]
	},
]
