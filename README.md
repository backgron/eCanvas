# eCanvas:用于构建canvas可控动画的JavaScript库

***

## 介绍

---

eCanvas是基于`JavaScript`通过`HTML5`中`canvas`标签构建`canvas`可控动画的JS库。通过eCanvas可以大大提高`canvas`相关功能（例如：canvas动画，canvas图片，基于canvas的H5游戏）开发的开发速度。在学习`eCanvas`的使用之前，需要先了解基本的`HTML`，`JavaScript`的基础知识。如果需要深入学习`eCanvas`的实现原理，请转到 eCanvas运行原理 。

### 安装 （开发中...）

+ 方法一：通过html 的script 引入资源库

```html
<script src='eCanvas.js'></script>
```

+ 方法二：通过npm安装

```npm
npm install ecanvas
```

### 起步

---

起步：我们将通过简短的代码，介绍`eCanvas`的基本使用，其中一些API将会在后期进行详细的介绍与解释，下面的例子为创建一个做斜上抛运动的方块。

+ 在`HTML`中创建 `canvas`标签 引入`eCanvas`核心库

  ```html
  <script src='eCanvas.js'></script>
  <canvas id='canvas' width="500" height="500"></canvas>
  ```

+ 创建 `eCanvas`对象

  ```js
  let canvas = document.querySelector('#canvas')
  let eCanvas = new ECanvas(canvas)
  ```

+ 创建一个 矩形 元素 对象`rect`

  ```js
  let rect = new ERect(10, 300, 10, 10, 'fill', 'red')
  ```

+ 给 `rect`配置运动属性

  ```js
  rect.initMove({
   Vx: 2,
   Vy: -7,
   Fy: 0.1
  })
  ```

+ 将`rect`挂载到`eCanvas`画布上

  ```js
  eCanvas.toBind(rect)
  ```

+ 使`rect`按照运动属性运动

  ```js
  rect.move()
  ```

+ 渲染`eCanvas`画布

  ```js
  eCanvas.draw()
  ```

### 对象化的元素

---

`canvas`原生元素本身绘制的图形会被像素画，变得无法寻找，无法控制，难以满足灵活性的需求。在`eCanvas`中我们将`canvas`原生元素抽象为对象，在使用过程中不关心`canvas`绘制本身，只关心所需绘制元素的各个特征，也就是对应对象的各个属性。元素的活动状态为对象的方法，通过配置对象和改变对象属性状态的方法，对`canvas`的图形元素进行操作。

正如上文创建的`rect`对象，在`canvas`中渲染则是一个坐标为 (10,300) 大小为 10x10 pixel 的红色实心矩形

```js
let rect = new ERect(10, 300, 10, 10, 'fill', 'red')
```

## 对象与API 

---

`eCanvas`中封装了许多常用的对象与API功能

### ECanvas 画布入口对象

---

`ECanvas`是所控制的画布的入口对象，它对接了DOM元素中的`<canvas>`标签，并封装了一些必要的属性和方法。

+ 创建 `ECanvas`对象

  ```js
  //1. 获取 DOM 元素 
  let canvas = document.querySelect('#canvas')
  //2. 创建ECanvas对象  (需要传入对应的 canvas DOM对象)
  let eCanvas = new ECanvas(canvas)
  ```

+ 类的属性

  |   **属性名**   |         **类型**         | **必须** | **描述**                                                     | **操作建议**           |
  | :------------: | :----------------------: | -------- | ------------------------------------------------------------ | ---------------------- |
  |     canvas     |    HTMLCanvasElement     | 是       | Ecanvas所绑定的DOM对象                                       | 仅初始化，不建议更改   |
  |       w        |          Number          | 否       | 画布的宽度                                                   | 可以直接操作           |
  |       h        |          Number          | 否       | 画布的高度                                                   | 可以直接操作           |
  |      ctx       | CanvasRenderingContext2D | 否       | 原生canvas API的一部分，可为<canvas>元素的绘图表面提供2D渲染上下文 | 只读                   |
  |    elements    |          Array           | 否       | 二维数组，存放canvas上所有需要渲染的元素对象                 | 不建议直接操作         |
  |     timeId     |          Array           | 否       | 存放ECanvas对象创建的定时器（setInterval）ID                 | 不建议直接操作         |
  |     rafID      |          Array           | 否       | 存放Ecanvas对象创建的请求动画关键帧\(requestAnimationFrame\)ID | 不建议直接操作         |
  |     event      |          Object          | 否       | 存放绑定事件的对象                                           | 不建议直接操作         |
  | eventType=\{\} |          Object          | 否       | 存放ECanvas绑定的事件                                        | 不建议直接操作         |
  |      bind      |          Object          | 否       | ECanvas的事件绑定状态                                        | 不建议直接操作         |
  |      name      |          String          | 否       | 对象的别名                                                   | 建议直接修改，赋初始值 |

  注：对象的宽度 `w` 和高度 `h` 为`canvas`标签的绑定属性，绑定后的`eCanvas`对象属性会随着DOM中的`canvas`的宽高而变化，反之亦然。

+ 类的方法

  |      **方法名称**       |                     **参数**                     | **返回值** | **描述**                    | **操作建议**   |
  | :---------------------: | :----------------------------------------------: | :--------: | :-------------------------- | :------------- |
  |        init\(\)         |                        无                        |     无     | eCanvas默认初始化方法       | 不建议直接操作 |
  |       toBind\(\)        |                  ele:MoveShape                   |     无     | 向当前Ecanvas对象中挂载元素 | 建议直接操作   |
  |      bindEvent\(\)      |                  ele:MoveShape                   |     无     | 添加事件元素的方法          | 不建议直接操作 |
  |     removeEvent\(\)     |                  ele:MoveShape                   |     无     | 移除事件绑定的方法          | 不建议直接操作 |
  |     removeBind\(\)      |                  ele:MoveShape                   |     无     | 接触元素挂载的方法          | 建议直接操作   |
  |       doEvent\(\)       |                        无                        |     无     | 执行时间代理的方法          | 不建议直接操作 |
  |    preRemoveBind（）    | eles:Array，removeFun:Function，clearFunFunction |   Number   | 元素预删除                  | 不建议直接操作 |
  |  addEventListener\(\)   |   Type:String，Name:String，callback:Function    |     无     | 为Ecanvas对象绑定事件       | 建议直接操作   |
  | removeEventListener\(\) |             Type:String，Name:String             |     无     | 为Ecanvas对象解绑事件       | 建议直接操作   |
  |        draw\(\)         |                callback:Function                 |     无     | 绘画出Ecanvas中的所有元素   | 建议直接操作   |
  
### MoveShape 可控元素的父类

  + 包含着可控元素运动的必要方法与属性
  
  + 内置：
  
    ```js
    class ERect extends MoveShape    // 矩形类
    class EArc extends MoveShape  //圆形类
    ```
  
  + 类的属性
  
    |   属性名   |      类型      | 必须 | 描述                                                         | 操作建议       |
    | :--------: | :------------: | ---- | ------------------------------------------------------------ | -------------- |
    |     Vx     |     Number     | 否   | 沿X轴方向的速度                                              | 可以直接操作   |
    |     Vy     |     Number     | 否   | 沿Y轴方向的速度                                              | 可以直接操作   |
    |     Fx     |     Number     | 否   | 沿X轴方向的力                                                | 可以直接操作   |
    |     Fy     |     Number     | 否   | 沿Y轴方向的力                                                | 可以直接操作   |
    |     m      |     Number     | 否   | 物体质量                                                     | 可以直接操作   |
    |   timeId   |     Array      | 否   | 存放对象创建的定时器（setInterval）ID                        | 不建议直接操作 |
    |   rafId    |     Array      | 否   | 存放Ecanvas对象创建的请求动画关键帧(requestAnimationFrame)ID | 不建议直接操作 |
    |    bind    | false\|Ecanvas | 否   | 对象的事件绑定状态                                           | 不建议直接操作 |
    |   zIndex   |     Number     | 否   | 对象的层级信息                                               | 可以直接操作   |
    | eventType  |     Object     | 否   | 存放对象绑定的事件                                           | 不建议直接操作 |
    |    name    |     String     | 否   | 对象的昵称                                                   | 建议直接操作   |
    | beforeDrow |    Function    | 否   | 绘画前可以执行的方法                                         | 可以直接操作   |
  
  + 类的方法
  
    |       **方法名**        |                 **参数**                  | **返回值** | **描述**                      | **操作建议**   |
    | :---------------------: | :---------------------------------------: | :--------: | ----------------------------- | -------------- |
    |    MoveShapeInit\(）    |                    无                     |     无     | 创建MoveShape对象的初始化方法 | 不建议直接操作 |
    |       iniMove\(\)       |               config:Object               |     无     | 初始化运动属性                | 建议直接操作   |
    |        move\(\)         |             callback:Function             |     无     | 开始按照运动属性运动          | 建议直接操作   |
    |       moveTo\(\)        |    stopConfig:Object,callback:Function    |     无     | 移动到指定状态后停止          | 建议直接操作   |
    |        stop\(\)         |             callback:Function             |     无     | 停止运动                      | 建议直接操作   |
    |      moveByKey\(\)      |   v:Number,key:Array,callback:Function    |     无     | 通过键盘控制元素运动          | 建议直接操作   |
    |  addEventListener\(\)   | type:String,name:String,callback:Function |     无     | 为对象添加事件                | 建议直接操作   |
    | removeEventListener\(\) |          type:String,name:String          |     无     | 为对象解绑事件                | 建议直接操作   |
    |       isEdge\(\)        |              pattern:String               |  Boolean   | 边缘检测                      | 建议直接操作   |

  ### ERect 矩形类

  + 内置图形
  
  + 类的属性
  
    |  属性名   |           类型           | 必须 | 描述                                                         | 操作建议       |
    | :-------: | :----------------------: | ---- | ------------------------------------------------------------ | -------------- |
    |     x     |          Number          | 是   | 矩形的X轴初始坐标                                            | 建议直接操作   |
    |     y     |          Number          | 是   | 矩形的y轴初始坐标                                            | 建议直接操作   |
    |   width   |          Number          | 是   | 矩形的宽                                                     | 建议直接操作   |
    |  height   |          Number          | 是   | 矩形的高                                                     | 建议直接操作   |
    |   color   |          String          | 否   | 矩形的颜色                                                   | 建议直接操作   |
    |    ctx    | CanvasRenderingContext2D | 否   | 原生canvas  API的一部分，可为<canvas>元素的绘图表面提供2D渲染上下文 | 不建议直接操作 |
    |   style   |          String          | 否   | 矩形空心还是实心                                             | 建议直接操作   |
    |  pointO   |          Array           | 否   | 原矩形左上角的点                                             | 不能直接操作   |
    |  pointX   |          Array           | 否   | 原矩形右上角的点                                             | 不能直接操作   |
    |  pointY   |          Array           | 否   | 原矩形左下角的点                                             | 不能直接操作   |
    |  pointXY  |          Array           | 否   | 原矩形右下角的点                                             | 不能直接操作   |
    |  matrix   |          Array           | 否   | 矩形的向量矩阵                                               | 不能直接操作   |
    |  pointM   |          String          | 否   | 矩形的旋转中心                                               | 不建议直接操作 |
    | direction |          Number          | 否   | 矩形的旋转角度                                               | 可以直接操作   |
    |  hitType  |          String          | 否   | 矩形的碰撞类型                                               | 不能直接操作   |
    |   name    |          String          | 否   | 矩形的昵称                                                   | 建议直接操作   |
    |   Image   |          Image           | 否   | 显示矩形图片的对象                                           | 不建议直接操作 |
    | imIsLoad  |         Boolean          | 否   | 矩形的图片加载是否完成                                       | 不建议直接操作 |
    |    img    |          String          | 否   | 矩形当前显示的图片路径                                       | 建议直接操作   |
    |   imgs    |          Array           | 否   | 矩形的所有图片资源路径                                       | 建议直接操作   |
  
  + 类的方法
  
    | 方法名      | 参数                           | 返回值 | 描述                      | 操作建议       |
    | ----------- | ------------------------------ | ------ | ------------------------- | -------------- |
    | init()      | 无                             | 无     | 创建ERect对象的初始化方法 | 不建议直接操作 |
    | setPoints() | 无                             | 无     | 同步位置信息的方法        | 不建议直接操作 |
    | rotate()    | direction:Number,pointM:String | 无     | 控制ERect图形旋转的方法   | 建议直接操作   |
    | initImage() | imgs:Array                     | 无     | 设置图片的方法            | 建议直接操作   |
    | draw()      | beforeDraw()                   | 无     | ERect图形的绘画方法       | 不建议直接操作 |

  ### EArc 圆形类

  + 类的属性
  
    |    属性名     |           类型           | 必须 | 描述                                                         | 操作建议       |
    | :-----------: | :----------------------: | ---- | ------------------------------------------------------------ | -------------- |
    |       x       |          Number          | 是   | 圆心的X轴坐标                                                | 建议直接操作   |
    |       y       |          Number          | 是   | 圆心的Y轴坐标                                                | 建议直接操作   |
    |    radius     |          Number          | 是   | 圆的半径                                                     | 可以直接操作   |
    |  startAngle   |          Number          | 否   | 开始位置                                                     | 可以直接操作   |
    |   endAngle    |          Number          | 否   | 结束位置                                                     | 可以直接操作   |
    | anticlockwise |         Boolean          | 否   | 是否为逆时针                                                 | 可以直接操作   |
    |     style     |          String          | 否   | 实心还是空心                                                 | 可以直接操作   |
    |     color     |          String          | 否   | 圆的颜色                                                     | 可以直接操作   |
    |      ctx      | CanvasRenderingContext2D | 否   | 原生canvas  API的一部分，可为<canvas>元素的绘图表面提供2D渲染上下文 | 不建议直接操作 |
    |    hitType    |          String          | 否   | 碰撞类型                                                     | 不建议直接操作 |
    |     name      |          String          | 否   | 圆的昵称                                                     | 建议直接操作   |
    |   beforDrow   |         Function         | 否   | 绘画开始前执行的方法                                         | 可以直接操作   |
  
  + 类的方法
  
    | 方法名 | 参数         | 返回值 | 描述               | 操作建议       |
    | ------ | ------------ | ------ | ------------------ | -------------- |
    | draw() | beforeDraw() | 无     | EArc图形的绘画方法 | 不建议直接操作 |

  ### MouseEvent 鼠标事件对象类

  + 类的属性
  
    | 属性      | 类型          | 必须 | 描述                        | 操作建议       |
    | --------- | ------------- | ---- | --------------------------- | -------------- |
    | canvasX   | Number        | 否   | 事件对象再canvas上的X轴坐标 | 不建议直接操作 |
    | canvasY   | Number        | 否   | 事件对象再canvas上的Y轴坐标 | 不建议直接操作 |
    | eventType | String        | 否   | 事件类型                    | 不建议直接操作 |
    | eventName | String        | 否   | 事件昵称                    | 不建议直接操作 |
    | shape     | MoveShape     | 否   | 触发事件的对象              | 不建议直接操作 |
    | shapeName | String        | 否   | 触发事件的对象的昵称        | 不建议直接操作 |
    | domEvent  | DomMouseEvent | 否   | dom中对应的事件对象         | 不建议直接操作 |

  ### 键盘事件对象类

  + 类的属性
  
    | 属性      | 类型        | 必须 | 描述                | 操作建议       |
    | --------- | ----------- | ---- | ------------------- | -------------- |
    | key       | String      | 否   | 按键的实际内容      | 不建议直接操作 |
    | code      | String      | 否   | 按键的代码内容      | 不建议直接操作 |
    | keyCode   | Number      | 否   | 按键符号的ASSIC内容 | 不建议直接操作 |
    | eventType | String      | 否   | 事件类型            | 不建议直接操作 |
    | eventName | String      | 否   | 事件的昵称          | 不建议直接操作 |
    | shapeName | String      | 否   | 触发事件对象的昵称  | 不建议直接操作 |
    | shape     | MoveShape   | 否   | 触发事件的对象      | 不建议直接操作 |
    | domEvent  | DomKeyEvent | 否   | dom中对应的事件对象 | 不建议直接操作 |

  ### 内置公用函数

+ 函数

  | 函数名         | 参数                                          | 返回值  | 描述               | 操作建议     |
  | -------------- | --------------------------------------------- | ------- | ------------------ | ------------ |
  | getVector()    | point:Array,point:Array                       | Array   | 输入两点，获取向量 | 可以直接操作 |
  | dot()          | vector:Array,vector:Array                     | Array   | 向量的点积         | 可以直接操作 |
  | cross()        | vector:Array,vector:Array                     | Number  | 向量的叉积         | 可以直接操作 |
  | pointToPoint() | point:Array,point:Array                       | Number  | 点到点距离的平方   | 可以直接操作 |
  | pointToLine()  | point:Array,linePoint1:Array,linePoint2:Array | Number  | 点到线段距离的平方 | 可以直接操作 |
  | pointInShape() | point:Array,shape:MoveShape                   | Boolean | 点是否再图形内     | 可以直接操作 |
  | isHit()        | element:MoveShape,element:MoveShape           | Boolean | 碰撞检测           | 建议直接操作 |

  参考文献

  1. bilibili  渔夫小朋友  [渔夫游戏开发教程-数学基础](https://space.bilibili.com/308864667/channel/detail?cid=89418)
  2. bilibili  渔夫小朋友  [【免费且完整】【渔夫】游戏开发教程-碰撞检测(合集) ](https://www.bilibili.com/video/BV1wJ411u7YB?spm_id_from=333.999.0.0)
  3. 稀土掘金   三只小羊  [canvas核心技术教学]([Canvas 核心技术 - 掘金 (juejin.cn)](https://juejin.cn/post/6844903636925939726))
  4. MDN   [canvas基础教学]([Canvas - Web API 接口参考 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API))
  5. TypeScript
  6. JavaScript





