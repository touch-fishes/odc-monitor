# Raycaster-交互拾取.md

## 1. 在整个场景下进行对某个元素进行 Hover 的高亮效果

### 分析

实现该场景需要以下要素：

1. 监听鼠标移动
2. 捕捉移动到的物体是否是需要捕捉的物体
3. 高亮该物体（高亮方式又是另一个技术领域，不在此处展开）

### 实现

定义全局变量和捕获事件
```js
// 定义一个 "移动点" 每次移动 的时候 更新这个移动点
this.movePointer = new THREE.Vector2();
// 定义一个光线投射，后续使用用来获取射线与目标物体是否相交
this.moveRaycaster = new THREE.Raycaster();
// 用于存储激活的物体
this.activeStation = null;
// 监听鼠标移动，每次移动的时候拿到当前坐标更新 "移动点"
document.addEventListener( 'mousemove', (event) => {
    this.movePointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    this.movePointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
});
```

在"可捕获物"上添加标识
```js
objLoader.load('./odc/model/monitor/monitor.obj', (obj) => {
    // 添加标识，只有拥有该标识 Group 下的 Mesh 才需要 高亮
    obj.userData.highlight = true;
    this.group.add(obj);
})
```

添加渲染高亮的方法
```js
// 获取所有需要 高亮 的 Group
const allSeats = this.getSeats();
// 更新射线
this.moveRaycaster.setFromCamera(this.movePointer, camera);
// 计算物体和射线的交点（可能是 桌子 可能是 显示器 可能是 主机）
const intersects = this.moveRaycaster.intersectObjects(allSeats, true);
// 有交集
if (intersects.length > 0) {
    // 第一个有交集的元素
    const firstObject = intersects[0].object;
    // 是不是可以进行高亮操作
    const isHighlightMesh = firstObject.parent.userData.highlight;
    // 高亮类型
    const elementType =  firstObject.parent.userData.type;
    // 当前元素不是正高亮的元素
    if (this.activeStation != firstObject && isHighlightMesh) {
        // 存在高亮元素 恢复高亮元素 颜色
        if (this.activeStation) {
            setHex(this.activeStation, this.activeStation.currentHex);
        }
        // 记录高亮元素以及原始色彩
        this.activeStation = firstObject;
        this.activeStation.currentHex = getHex(this.activeStation);
        // 高亮
        this.highlightElement(elementType, this.activeStation);
    }
} else {
    // 无交叉元素， 当前还有激活元素，恢复元素本色
    if (this.activeStation) {
        setHex(this.activeStation, this.activeStation.currentHex);
    }
    // 移除高亮元素
    this.activeStation = null;
}
```

在每一"瞬间"都执行高亮方法
```js
class ODC {
    animate() {
        if (this.southWorkstation) {
            this.southWorkstation.renderActiveStation(this.camera);
        }
        requestAnimationFrame( this.animate.bind(this) );
    }
}
```
### 注意事项

- Group 是无法进行交互拾取的，只能在其子 Mesh 进行交互拾取
- 所有的高亮效果只能加在 Mesh 上，Group 是无法加的
- 为了提高性能需要筛选出需要交互拾取的 Group 和 Mesh 

### 遗留问题

requestAnimationFrame 比较耗费性能如何优化？能否在鼠标移动时 render？
