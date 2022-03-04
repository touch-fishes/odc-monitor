import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {OutlinePass} from "three/examples/jsm/postprocessing/OutlinePass";
import {getIntersected} from "@/scenes/util/raycaster";
import {clientX2X, clientY2Y} from "@/scenes/util/location";
import {ClickObserver} from "@/scenes/odc/event/click";

export class ClickEvent {

  private observers: ClickObserver[];

  public addObserver(observer: ClickObserver) {
    this.observers.push(observer);
  }

  public constructor() {
    // 被观测的实例
    this.observers = [];
    this.bindEvent();
  }

  private bindEvent() {
    document.addEventListener('click', (event) => {
      const x = clientX2X(event.clientX);
      const y = clientY2Y(event.clientY);
      // 遍历每一个观测者 找到中奖选手
      const { inactive, active } = this.getObserverGroup({ x, y });
      inactive.forEach(({ observer }) => {
        if (observer.beforeClick) observer.beforeClick();
      });
      // 中断标识
      let isStop = false;
      active.forEach(({ observer }) => {
        if (observer.beforeClick) observer.beforeClick();
        if (!isStop && observer.onClick) isStop = observer.onClick();
      });
    })
  }
}
