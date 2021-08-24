import * as THREE from 'three';

// @ts-ignore
import { generateTextSprite } from '@/scenes/util/generate-text-sprite';
import { bizGroupInfo } from '@/data/workstations-data';
import { getCenterOfModelArea, scale } from '@/scenes/util/location';
import { ModelPointer } from '@/scenes/types';
import { WALL_HEIGHT } from '@/data/buildings-data';

export class ProjectBrands extends THREE.Group {
    public static clazzName = 'projectBrand';
    private projectBrands: THREE.Sprite[];
    public constructor() {
        super();
        this.projectBrands = this.createProjectBrands();
        this.projectBrands.forEach((monitor) => this.add(monitor));
    }

    private createProjectBrands() {
        return bizGroupInfo.map((project) => {
            const textSprite = generateTextSprite(project.code || '', {
                fontSize: 24,
                fontColor: 'rgba(255, 255, 255, 1)',
                fontBold: false,
                fontItalic: false,
                textAlign: 'center',
                borderThickness: 3,
                borderColor: '#afe5f3',
                borderRadius: 6,
                backgroundColor: '#afe5f3',
            });
            const { begin, end } = project;
            const { x, z } = getCenterOfModelArea(begin as ModelPointer, end as ModelPointer);
            textSprite.position.z = z;
            textSprite.position.x = x;
            textSprite.position.y = scale((WALL_HEIGHT * 3) / 5);
            return textSprite;
        });
    }
}
