import {Object3D} from "three";

export type ModelPointer = [number, number];

export interface ModelLine {
    begin: ModelPointer;
    end: ModelPointer;
}

export interface SofaObj3D {
  sofaObj3D: Object3D
}

export interface KitchenObj3D {
  kitchenObj3D: Object3D
}

export interface CameraMonitorObj3D {
  cameraMonitorObj3D: Object3D
}

export interface CoffeeTableObj3D {
  coffeeTableObj3D: Object3D
}
