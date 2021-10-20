# eCanvas:用于构建canvas可控动画的JavaScript库

***

## 介绍

---

eCanvas是基于`JavaScript`通过`HTML5`中`canvas`标签构建`canvas`可控动画的JS库。通过eCanvas可以大大提高`canvas`相关功能（例如：canvas动画，canvas图片，基于canvas的H5游戏）开发的开发速度。在学习`eCanvas`的使用之前，需要先了解基本的`HTML`，`JavaScript`的基础知识。如果需要深入学习`eCanvas`的实现原理，请转到 eCanvas运行原理 。

### 安装

+ 方法一：通过html 的script 引入资源库

```html
<script src='index.js'></script>
```

+ 方法二：通过npm安装

```npm
npm install ECanvas
```

### 起步

---

起步：我们将通过简短的代码，介绍`eCanvas`的基本使用，其中一些API将会在后期进行详细的介绍与解释，下面的例子为创建一个做斜上抛运动的方块。

+ 在`HTML`中创建 `canvas`标签

  ```html
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
   Vx: 5,
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
  eCanvas.drow()
  ```

### 对象化的元素

---

`canvas`原生元素本身绘制的图形无法寻找，无法控制，难以满足灵活性的需求。在`eCanvas`中我们将`canvas`原生元素抽象为对象，在使用过程中不关心`canvas`绘制本身，只关心所需绘制元素的各个特征，也就是对应对象的各个属性。元素的活动状态为对象的方法，通过配置对象和改变对象属性状态的方法，对`canvas`的图形元素进行操作。

正如上文创建的`rect`对象，在`canvas`中渲染则是一个坐标为 (10,300) 大小为 10x10 pixel 的红色实心矩形

```js
let rect = new ERect(10, 300, 10, 10, 'fill', 'red')
```

### Hello World

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

+ 对象的属性

  | 属性     | 类型                     | 是否必须 | 默认值 | 描述                                                         |
  | -------- | ------------------------ | -------- | ------ | ------------------------------------------------------------ |
  | canvas   | DOM对象                  | 是       | null   | 保存着对应的DOM对象，所需的唯一参数                          |
  | w        | Number                   | 否       | 0      | canvas画布的宽度（只读）                                     |
  | h        | Number                   | 否       | 0      | canvas画布的高度（只读）                                     |
  | ctx      | CanvasRenderingContext2D | 否       | null   | 原生canvas API的一部分，可为<canvas>元素的绘图表面提供2D渲染上下文 |
  | elements | Array                    | 否       | []     | 存放canvas上所有需要渲染的元素对象                           |
  | timeID   | Array                    | 否       | []     | 存放ECanvas对象创建的定时器（setInterval）ID                 |
  | rafID    | Array                    | 否       | []     | 存放ECanvas对象创建的请求动画关键帧（requestAnimationFrame) ID |

+ 对象的方法

  









