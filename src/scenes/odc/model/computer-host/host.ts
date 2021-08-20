import * as THREE from 'three';

export class Host extends THREE.Group {
    public readonly baseWidth: number;
    public readonly baseHeight: number;
    public readonly baseDepth: number;
    public readonly host: THREE.Mesh<THREE.BoxGeometry, THREE.MeshLambertMaterial>;
    public readonly hostMaterial: THREE.MeshLambertMaterial;

    public constructor() {
        super();
        this.baseHeight = 18;
        this.baseDepth = 6;
        this.baseWidth = 18;
        this.host = this.createHost();
        this.hostMaterial = this.host.material;
        this.add(this.host);
    }

    public active() {
        this.host.material = new THREE.MeshPhongMaterial({ color: 0x409eff });
    }

    public silence() {
        this.host.material = this.hostMaterial;
    }

    protected createHostGeometry() {
        return new THREE.BoxGeometry(this.baseWidth, this.baseHeight, this.baseDepth);
    }

    protected createHostMaterial() {
        return new THREE.MeshLambertMaterial({ color: '#282c34' });
    }

    protected createHost() {
        return new THREE.Mesh(this.createHostGeometry(), this.createHostMaterial());
    }
}
