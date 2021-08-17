import { Host } from './host.js'

export class HWHost extends Host {

	static clazzName = 'HWHost';

	constructor() {
		super()
		this.userData.clazzName = HWHost.clazzName;
	}
}
