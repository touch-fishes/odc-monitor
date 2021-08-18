import { Host } from './host';

export class HWHost extends Host {
    public static clazzName = 'HWHost';

    public constructor() {
        super();
        this.userData.clazzName = HWHost.clazzName;
    }
}
