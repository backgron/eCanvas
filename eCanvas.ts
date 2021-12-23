/**eCanvas 入口类
 * eCanvas 入口类
 *  属性：
 *    canvas：DOM 树中的 canvas 元素
 *    w:canvas的宽度
 *    h:canvas的高度
 *    ctx：canvas 对应的上下文对象
 *    element：canvas 索要渲染的所有对象
 *    timeId: ECanvas 下所有定时器的 ID
 *    rafID：ECanvas 下所有请求动画关键帧的ID
 * 
 *  */
class ECanvas {
  canvas: HTMLCanvasElement
  w: number
  h: number
  ctx: CanvasRenderingContext2D
  elements: Array<Array<MoveShape>>
  timeId: Array<number>
  rafId: Array<number>
  event: object
  eventType: object
  bind: false | ECanvas
  name: string

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.w = 0
    this.h = 0
    this.ctx = null
    this.elements = [
      [],
      [],
      []
    ]
    this.timeId = []
    this.rafId = []
    this.event = {
      click: [],
      keydown: [],
      keyup: [],
      mousedown: [],
      mousemove: [],
      mouseup: [],
    }
    this.eventType = {}
    this.bind = false

    this.name = 'ECanvas'

    this.init()
  }

  init() {
    //绑定 w
    Object.defineProperty(this, 'w', {
      set: function (value) {
        this.canvas.width = value
      },
      get: function () {
        return this.canvas.width
      }
    })

    //绑定 h
    Object.defineProperty(this, 'h', {
      set: function (value) {
        this.canvas.height = value
      },
      get: function () {
        return this.canvas.height
      }
    })

    //获取上下文对象
    if (this.canvas.getContext) {
      this.ctx = this.canvas.getContext('2d')
    } else {
      console.error('您的浏览器不支持 "<canvas>" 标签')
    }

    this.doEvent()
  }

  //向画布中挂载对象
  toBind(ele: MoveShape) {
    if (ele && !ele.bind) {
      ele.ctx = this.ctx
      ele.bind = this
      this.elements[ele.zIndex].push(ele)
    }

  }

  //添加事件元素
  bindEvent(ele: MoveShape | ECanvas) {
    for (let event in ele.eventType) {
      if (this.event[event].indexOf(ele) === -1) {
        this.event[event].push(ele)
      }
    }
  }

  //移出事件绑定
  removeEvent() { }

  //解除挂载
  removeBind(ele: MoveShape) {
    ele.stop()
    if (ele) {
      ele.ctx = null
      ele.bind = false
      console.log('remove')
    } else {
      console.warn(ele + '对象不存在')
    }
  }

  //执行事件代理 
  doEvent() {
    //创建鼠标事件的方法
    let createEMouseEvent = (type: eventType, e: MouseEvent) => {
      for (let i = 0; i < this.event[type].length; i++) {
        if (!this.event[type][i].bind) {
          this.event[type].splice(i, 1)
          i--
          continue
        }
        //创建点击事件的事件对象
        let event = new EMouseEvent(type, e, this, i)
        //判断是否触发事件
        if (this.event[type][i] instanceof ECanvas) {
          for (let fn in this.eventType[type]) {
            if (this.eventType[type][fn]) {
              event.eventName = fn
              this.eventType[type][fn].call(this, event)
            }
          }
        } else if (pointInShape([event.canvasX, event.canvasY], this.event[type][i])) {
          for (let fn in event.shape.eventType[type]) {
            if (event.shape.eventType[type][fn]) {
              event.eventName = fn
              event.shape.eventType[type][fn].call(event.shape, event)
            }
          }
        }
      }
    }
    //注册鼠标相关事件
    //鼠标点击事件
    this.canvas.addEventListener('click', (e) => {
      createEMouseEvent('click', e)
    })
    //鼠标按下事件
    this.canvas.addEventListener('mousedown', (e) => {
      createEMouseEvent('mousedown', e)
    })
    //鼠标抬起事件
    this.canvas.addEventListener('mouseup', (e) => {
      createEMouseEvent('mouseup', e)
    })
    //鼠标移动事件
    this.canvas.addEventListener('mousemove', (e) => {
      createEMouseEvent('mousemove', e)
    })

    //创建键盘相关事件的方法
    let createEKeyEvent = (type: eventType, e) => {
      for (let i = 0; i < this.event[type].length; i++) {
        let event = new EKeyEvent(type, e, this, i)
        for (let fn in event.shape.eventType[type]) {
          if (event.shape.eventType[type][fn]) {
            event.eventName = fn
            event.shape.eventType[type][fn].call(event.shape, event)
          }
        }
      }
    }
    //注册键盘相关事件
    //键盘按下事件
    window.addEventListener('keydown', (e) => {
      createEKeyEvent('keydown', e)
    })
    //键盘抬起事件
    window.addEventListener('keyup', (e) => {
      createEKeyEvent('keyup', e)
    })
  }

  //预删除
  preRemoveBind(arr: Array<MoveShape>, removeFun: Function, clearFun: Function) {
    let id = setInterval(() => {
      for (let i = 0; i < arr.length; i++) {
        if (removeFun(arr[i])) {
          this.removeBind(arr[i])
          arr.splice(i, 1)
          i--
          continue
        }
        if (typeof clearFun === 'function') {
          if (clearFun()) {
            clearInterval(id)
          }
        }
      }
    }, 10)
    if (!clearFun) {
      console.warn('如果不及时清理元素集预删除(preRemoveBind)时所产生的定时器，可能会造成资源浪费哦,建议添加clearFun方法自动清理(推荐)或者通过定时器(clearInterval)id手动清理,添加true参数可以关闭提示')
    }
    return id
  }

  //添加事件
  addEventListener(type: eventType, name: string, callback: Function | undefined = undefined) {
    if (this.eventType[type] === undefined) {
      this.eventType[type] = {}
      this.eventType[type][name] = callback
    } else {
      this.eventType[type][name] = callback
    }
    this.bindEvent(this)
  }

  //移出事件
  removeEventListener(type: eventType, name: string) {
    this.eventType[type][name] = undefined
  }
  // 页面渲染入口
  draw(callback: Function | undefined = undefined) {
    let rafId: number
    let animate = () => {
      this.ctx.clearRect(0, 0, this.w, this.h)
      for (let i = 0; i < this.elements.length; i++) {
        for (let j = 0; j < this.elements[i].length; j++) {
          let ele = this.elements[i][j]
          //判断是否位于绑定状态
          if (!ele.bind) {
            this.elements[i].splice(j, 1)
            j--
            continue
          }
          //判断是否更换层级
          if (ele.zIndex !== i) {
            this.elements[this.elements[i][j].zIndex].push(this.elements[i][j])
            this.elements[i].splice(j, 1)
            ele.draw()
            continue
          }
          this.elements[i][j].draw()
        }
      }
      window.requestAnimationFrame(animate)
    }
    animate()
  }

}

/**可控元素的父类
 * 可控元素的父类
 *   属性:
    Mx: 元素的几何中心点  x 坐标
    My: 元素的几何中心点  y 坐标
    Vx: 元素沿 x 轴的速度
    Vy：元素沿 y 轴的移动速度
    Fx：元素沿 x 轴的受力
    Fy：元素沿着 y 轴的受力
    m： 元素的相对质量
    bind: 是否已经挂在到 ECanvas 上
 * 
*/
class MoveShape {
  x: number
  y: number
  Vx: number
  Vy: number
  Fx: number
  Fy: number
  m: number
  timeId: Array<number>
  rafId: Array<number>
  bind: false | ECanvas
  zIndex: number
  eventType: object
  name: string
  beforeDrow: Function
  ctx: CanvasRenderingContext2D
  hitType: hitType
  constructor(Vx = 0, Vy = 0, Fx = 0, Fy = 0, m = 1) {
    //元素运动信息
    this.Vx = Vx
    this.Vy = Vy
    this.Fx = Fx
    this.Fy = Fy
    this.m = m

    //元素定时器
    this.timeId = []
    this.rafId = []
    //是否绑定在canvas画布上
    this.bind = false

    //层级信息
    this.zIndex = 1

    //事件信息
    this.eventType = {}

    //特征名称信息
    this.name = 'unnamed-MoveShape'

    //绘画的回调函数
    this.beforeDrow
  }


  //初始化运动属性
  initMove(config: object) {
    if (config) {
      for (let key in config) {
        this[key] = config[key]
      }
    }
  }

  //开始按照属性运动
  move(callback: Function | undefined = undefined) {
    this.timeId.push(setInterval(() => {
      this.Vx += this.Fx
      this.Vy += this.Fy
      this.x += this.Vx
      this.y += this.Vy
    }, 16))
    if (callback) {
      callback()
    }
  }

  // 移动到指定的状态
  moveTo(stopConfig: object, callback: Function | undefined = undefined) {
    this.move()
    this.timeId.push(setInterval(() => {
      for (let key in stopConfig) {
        if (stopConfig[key] > this[key] - 2 * (this.Vx + this.Vy) && stopConfig[key] < this[key] + 2 * (this.Vx + this.Vy)) {
          this[key] = stopConfig[key]
          this.stop()
          if (callback) {
            callback()
          }
        }
      }
    }, 1))
  }

  //停止运动
  stop(callback: Function | undefined = undefined) {
    for (let i = 0; i < this.timeId.length; i++) {
      clearInterval(this.timeId[i])
    }
    for (let i = 0; i < this.rafId.length; i++) {
      window.cancelAnimationFrame(this.rafId[i])
    }
    this.rafId = []
    this.timeId = []
    this.Vx = 0
    this.Vy = 0
    this.Fx = 0
    this.Fy = 0
    if (callback) {
      callback()
    }
  }

  //通过键盘上下左右运动
  moveByKey(v = 3, key = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'], callback: Function | undefined = undefined) {
    if (callback) {
      callback()
    }
    window.addEventListener('keydown', (e) => {
      switch (e.key) {
        case key[0]:
          this.Vy = -v
          break
        case key[1]:
          this.Vx = v
          break
        case key[2]:
          this.Vy = v

          break
        case key[3]:
          this.Vx = -v

          break
      }
    })
    window.addEventListener('keyup', (e) => {
      switch (e.key) {
        case 'ArrowUp':
          this.Vy = 0
          break
        case 'ArrowDown':
          this.Vy = 0
          break
        case 'ArrowLeft':
          this.Vx = 0
          break
        case 'ArrowRight':
          this.Vx = 0
          break
      }
    })
    this.move()
  }

  //添加事件
  addEventListener(type: string, name: string, callback: Function | undefined = undefined) {
    if (this.bind === false) {
      console.warn('请在添加事件前先将元素绑定到eCanvas对象上')
    } else {
      if (this.eventType[type] === undefined) {
        this.eventType[type] = {}
        this.eventType[type][name] = callback
      } else {
        this.eventType[type][name] = callback
      }
      this.bind.bindEvent(this)
    }
  }

  //移出事件帮i的那个
  removeEventListener(type: eventType, name: string) {
    this.eventType[type][name] = undefined
  }

  draw(beforeDrow: Function | undefined = undefined) {

  }

}

/**可控矩形ERect
 * 属性：
 *  x：矩形左上角x坐标
 *  y：矩形左上角y坐标
 *  w：矩形宽度
 *  h：矩形高度
 *  shape：矩形实心（fill）或者空心（stroke）
 *  color：矩形颜色
 */
class ERect extends MoveShape {
  width: number
  height: number
  color: string
  style: string
  pointO: Array<number>
  pointX: Array<number>
  pointY: Array<number>
  pointXY: Array<number>
  matrix: Array<number>
  pointM: string
  direction: number
  image: HTMLImageElement
  imgIsLoad: boolean
  img: string
  imgs: Array<string>

  constructor(x: number, y: number, width: number, height: number, style = 'fill', color = '#000') {
    super()
    //rect 基础属性
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color = color
    this.ctx = null
    this.style = style

    //位置信息
    this.pointO
    this.pointX
    this.pointY
    this.pointXY
    this.matrix
    this.pointM
    this.direction = 0

    //碰撞信息
    this.hitType = 'AABB'

    //命名
    this.name = 'unnamed-ERect'

    //图片信息
    this.image = new Image()
    this.imgIsLoad = false
    this.img
    this.imgs = []

    this.init()

  }
  //初始化信息
  init() {
    this.pointM = 'leftTop'
    this.setPoints()

    Object.defineProperty(this, 'hitType', {
      get: function () {
        return this.direction % Math.PI / 2 === 0 ? 'AABB' : 'Rect'
      }
    })
  }

  //同步位置信息
  setPoints() {
    Object.defineProperty(this, 'matrix', {
      get: function () {
        switch (this.pointM) {
          case 'middle':
            return this.matrix = [
              [-this.width / 2 * Math.cos(this.direction), -this.width / 2 * Math.sin(this.direction),
              this
                .x
              ],
              [-this.height / 2 * Math.sin(this.direction), -this.height / 2 * Math.cos(this.direction),
              this
                .y
              ],
              [0, 0, this.direction]
            ]
          case 'leftTop':
            return this.matrix = [
              [this.width * Math.cos(this.direction), this.width * Math.sin(this.direction), this.x],
              [-this.height * Math.sin(this.direction), this.height * Math.cos(this.direction), this.y],
              [0, 0, this.direction]
            ]
          case 'rightTop':
            return this.matrix = [
              [(-this.width) * Math.cos(this.direction), (-this.width) * Math.sin(this.direction), this
                .x
              ],
              [-this.height * Math.sin(this.direction), this.height * Math.cos(this.direction), this.y],
              [0, 0, this.direction]
            ]
          case 'leftBottom':
            return this.matrix = [
              [this.width * Math.cos(this.direction), this.width * Math.sin(this.direction), this.x],
              [this.height * Math.sin(this.direction), -this.height * Math.cos(this.direction), this.y],
              [0, 0, this.direction]
            ]
          case 'rightBottom':
            return this.matrix = [
              [-this.width * Math.cos(this.direction), -this.width * Math.sin(this.direction), this.x],
              [this.height * Math.sin(this.direction), -this.height * Math.cos(this.direction), this.y],
              [0, 0, this.direction]
            ]
        }
      },
      set: function () {

      }
    })
    Object.defineProperty(this, 'pointO', {
      get: function () {
        switch (this.pointM) {
          case 'middle':
            return [(-this.width / 2) * Math.cos(this.direction) - (-this.height / 2) * Math.sin(this
              .direction) + this.x, (-this.width / 2) * Math.sin(this.direction) + (-this.height / 2) *
              Math
                .cos(this
                  .direction) + this.y
            ]
          case 'leftTop':
            return [this.x, this.y]
          case 'rightTop':
            return [this.matrix[0][0] + this.x + this.width, this.matrix[0][1] + this.y]
          case 'leftBottom':
            return [this.matrix[1][0] + this.x, this.matrix[1][1] + this.y + this.height]
          case 'rightBottom':
            return [-this.width * Math.cos(this.direction) + this.height * Math.sin(this.direction) + this
              .x +
              this.width,
            -this.height * Math.cos(this.direction) - this.width * Math.sin(this.direction) + this.y +
            this
              .height
            ]
        }
      }
    })
    Object.defineProperty(this, 'pointX', {
      get: function () {
        switch (this.pointM) {
          case 'middle':
            return [(this.width / 2) * Math.cos(this.direction) - (-this.height / 2) * Math.sin(this
              .direction) + this.x,
            (this.width / 2) * Math.sin(this.direction) + (-this.height / 2) * Math.cos(this
              .direction) +
            this.y
            ]
          case 'leftTop':
            return [this.matrix[0][0] + this.x, this.matrix[0][1] + this.y]
          case 'rightTop':
            return [this.width + this.x, this.y]
          case 'leftBottom':
            return [this.width * Math.cos(this.direction) + this.height * Math.sin(this.direction) + this.x,
            -this.height * Math.cos(this.direction) + this.width * Math.sin(this.direction) + this.y +
            this
              .height
            ]
          case 'rightBottom':
            return [this.matrix[1][0] + this.x + this.width, this.matrix[1][1] + this.y + this.height]
        }

      }
    })
    Object.defineProperty(this, 'pointY', {
      get: function () {
        switch (this.pointM) {
          case 'middle':
            return [(-this.width / 2) * Math.cos(this.direction) - (this.height / 2) * Math.sin(this
              .direction) + this.x,
            (-this.width / 2) * Math.sin(this.direction) + (this.height / 2) * Math.cos(this
              .direction) +
            this.y
            ]
          case 'leftTop':
            return [this.matrix[1][0] + this.x, this.matrix[1][1] + this.y]
          case 'rightTop':
            return [-this.width * Math.cos(this.direction) - this.height * Math.sin(this.direction) + this
              .x +
              this.width,
            this.height * Math.cos(this.direction) + (-this.width) * Math.sin(this.direction) + this.y
            ]
          case 'leftBottom':
            return [this.x, this.y + this.height]
          case 'rightBottom':
            return [this.matrix[0][0] + this.x + this.width, this.matrix[0][1] + this.y + this.height]
        }
      }
    })
    Object.defineProperty(this, 'pointXY', {
      get: function () {
        switch (this.pointM) {
          case 'middle':
            return [(this.width / 2) * Math.cos(this.direction) - (this.height / 2) * Math.sin(this
              .direction) +
              this.x,
            (this.width / 2) * Math.sin(this.direction) + (this.height / 2) * Math.cos(this.direction) +
            this.y
            ]
          case 'leftTop':
            return [this.width * Math.cos(this.direction) - this.height * Math.sin(this.direction) + this.x,
            this.height * Math.cos(this.direction) + this.width * Math.sin(this.direction) + this.y
            ]
          case 'rightTop':
            return [this.matrix[1][0] + this.x + this.width, this.matrix[1][1] + this.y]
          case 'leftBottom':
            return [this.matrix[0][0] + this.x, this.matrix[0][1] + this.y + this.height]
          case 'rightBottom':
            return [this.x + this.width, this.y + this.height]
        }
      }
    })
  }

  //控制旋转的方法 
  rotate(direction: number, pointM = 'middle') {
    this.direction = direction
    this.pointM = pointM
  }

  //设置图片的方法 
  initImage(imgs: Array<string>) {
    this.imgs = imgs
    let loadComplete = async (src) => {
      return new Promise((resolve) => {
        this.image.src = src
        this.image.onload = () => {
          // console.log(1)
          // console.log('img load completed!' + src)
          resolve('sucess')
        }
      })
    }
    let init = async () => {
      // console.log(this)
      let res = await Promise.all(this.imgs.map(src => {
        loadComplete(src)
      }))
      // console.log(true)
      this.imgIsLoad = true
      this.img = this.imgs[0]
    }
    init()
  }

  //边界检测
  isEdge(pattern: String) {
    if (pattern === 'touch') {
      if (this.hitType === 'AABB') {
        if (this.x > 0 && this.x < (this.bind as ECanvas).w - this.width && this.y > 0 && this.y < (this.bind as ECanvas).h - this.height) {
          return false
        } else {
          return true
        }
      }
    }

  }



  //绘画的方法
  draw(beforeDrow: Function | undefined = undefined) {
    if (typeof beforeDrow === 'function') {
      beforeDrow()
    }
    if (this.imgIsLoad) {
      this.ctx.translate(this.pointO[0], this.pointO[1])
      this.ctx.rotate(this.direction)
      this.ctx.drawImage(this.image, 0, 0)
      this.ctx.rotate(-this.direction)
      this.ctx.translate(-this.pointO[0], -this.pointO[1])
    }

    this.ctx.beginPath()
    this.ctx.moveTo(this.pointO[0], this.pointO[1])
    this.ctx.lineTo(this.pointX[0], this.pointX[1])
    this.ctx.lineTo(this.pointXY[0], this.pointXY[1])
    this.ctx.lineTo(this.pointY[0], this.pointY[1])
    this.ctx.lineTo(this.pointO[0], this.pointO[1])
    if (this.style === 'fill') {
      this.ctx.fillStyle = this.color
      this.ctx.fill()
    } else if (this.style === 'stroke') {
      this.ctx.strokeStyle = this.color
      this.ctx.stroke()
    }
  }
}

/**可控圆形EArc
 * 
 * 
 */
class EArc extends MoveShape {
  radius: number
  startAngle: number
  endAngle: number
  anticlockwise: boolean
  style: string
  color: string
  name: string
  beforDrow: Function
  constructor(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise = true, style = 'fill', color = '#000') {
    super()
    //基本信息
    this.x = x
    this.y = y
    this.radius = radius
    this.startAngle = startAngle
    this.endAngle = endAngle
    this.anticlockwise = anticlockwise
    this.style = style
    this.color = color
    this.ctx = null
    //碰撞信息
    this.hitType = 'Arc'
    //名称
    this.name = 'unnamed-EArc'

    //绘画
    this.beforDrow
  }

  draw(beforeDrow: Function | undefined = undefined) {
    if (typeof beforeDrow === 'function') {
      beforeDrow()
    }
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, this.anticlockwise)
    if (this.style === 'fill') {
      this.ctx.fillStyle = this.color
      this.ctx.fill()
    } else if (this.style === 'stroke') {
      this.ctx.strokeStyle = this.color
      this.ctx.stroke()
    }
  }
}

//公用方法
//获取向量
function getVector(point1: Array<number>, point2: Array<number>) {
  return [point2[0] - point1[0], point2[1] - point1[1]]
}
//点乘向量
function dot(vector1: Array<number>, vector2: Array<number>) {
  return vector1[0] * vector2[0] + vector1[1] * vector2[1]
}
//叉乘向量
function cross(vector1: Array<number>, vector2: Array<number>) {
  return vector1[0] * vector2[1] - vector1[1] * vector2[0]
}
//图形判断位置的方法
//点到点距离的平方
function pointToPoint(point1: Array<number>, point2: Array<number>) {
  return (point1[0] - point2[0]) * (point1[0] - point2[0]) + (point1[1] - point2[1]) * (point1[1] - point2[1])
}
//点到线段的最短距离 平方
function pointToLine(point: Array<number>, linePoint1: Array<number>, linePoint2: Array<number>) {
  //直线向量
  let lineVector = getVector(linePoint1, linePoint2)
  //点积 
  let m = dot(getVector(linePoint1, point), lineVector)
  let n = dot(lineVector, lineVector)
  if (m <= 0) {
    return pointToPoint(linePoint1, point)
  } else if (m >= n) {
    return pointToPoint(linePoint2, point)
  } else {
    return (pointToPoint(linePoint1, point) - m * m / pointToPoint(linePoint2, linePoint1))
  }
}
//点是否在图形内
function pointInShape(point: Array<number>, shape: MoveShape) {
  if (shape.hitType === 'Arc') {
    if (pointToPoint(point, [shape.x, shape.y]) > (shape as EArc).radius * (shape as EArc).radius) {
      return false
    } else {
      return true
    }
  } else {
    let o = (shape as ERect).pointO
    let x = (shape as ERect).pointX
    let xy = (shape as ERect).pointXY
    let y = (shape as ERect).pointY
    let ox = getVector(o, x)
    let op = getVector(o, point)
    let xxy = getVector(x, xy)
    let xp = getVector(x, point)
    let xyy = getVector(xy, y)
    let xyp = getVector(xy, point)
    let yo = getVector(y, o)
    let yp = getVector(y, point)

    if (dot(ox, op) >= 0 && dot(xxy, xp) >= 0 && dot(xyy, xyp) >= 0 && dot(yo, yp) >= 0) {
      return true
    } else {
      return false
    }
  }
}

//碰撞检测
function isHit(element1: MoveShape, element2: MoveShape) {
  // AABB元素的碰撞检测
  if (element1.hitType === 'AABB' && element2.hitType === 'AABB') {
    // AABB（未旋转矩形）的碰撞检测
    let minX = Math.max((element1 as ERect).pointO[0], (element2 as ERect).pointO[0])
    let minY = Math.max((element1 as ERect).pointO[1], (element2 as ERect).pointO[1])
    let maxX = Math.min((element1 as ERect).pointX[0], (element2 as ERect).pointX[0])
    let maxY = Math.min((element1 as ERect).pointY[1], (element2 as ERect).pointY[1])
    if (minX < maxX && minY < maxY) {
      return true
    }
    return false
  }

  //圆形和圆形
  if (element1.hitType === 'Arc' && element2.hitType === 'Arc') {
    let d = pointToPoint([element1.x, element1.y], [element2.x, element2.y])
    let r = (element1 as EArc).radius * (element1 as EArc).radius + (element2 as EArc).radius * (element2 as EArc).radius
    if (d > r) {
      return false
    } else {
      return true
    }
  }

  //圆形和矩形
  if (((element1.hitType === 'AABB' || element1.hitType === 'Rect') && element2.hitType === 'Arc') || ((element2.hitType === 'AABB' || element2.hitType === 'Rect') && element1.hitType === 'Arc')) {
    let arc: MoveShape
    let rect: MoveShape
    if (element1.hitType === 'Arc') {
      arc = element1
      rect = element2
    } else {
      arc = element2
      rect = element1
    }

    //圆心坐标 p
    let p = [arc.x, arc.y]
    if (pointInShape(p, rect)) {
      return true
    } else {
      let o = (rect as ERect).pointO
      let x = (rect as ERect).pointX
      let xy = (rect as ERect).pointXY
      let y = (rect as ERect).pointY
      let r = (arc as EArc).radius * (arc as EArc).radius

      if (pointToLine(p, o, x) <= r || pointToLine(p, x, xy) <= r || pointToLine(p, xy, y) <= r || pointToLine(p, y, o) <= r) {
        return true
      } else {
        return false
      }
    }
  }

  //矩形和矩形
  if ((element1.hitType === 'Rect' || element2.hitType === 'Rect') && element1.hitType !== 'Arc' && element2.hitType !== 'Arc') {
    let rect = element1
    let shape = element2
    for (let i = 0; i < 2; i++) {
      let o = (rect as ERect).pointO
      let x = (rect as ERect).pointX
      let xy = (rect as ERect).pointXY
      let y = (rect as ERect).pointY
      if (pointInShape(o, shape) || pointInShape(x, shape) || pointInShape(xy, shape) || pointInShape(y, shape)) {
        return true
      } else {
        rect = element2
        shape = element1
      }
    }
    return false
  }

  //封印 BUG 的盒子！！！！！！！！！！
  let bugBox = () => {
    //基于分离轴原理的碰撞检测   不对，有bug
    // 获取矩形的分离轴
    let getRectAxis = (element) => {
      if (element.hitType === 'AABB' || element.hitType === 'Rect') {
        let vector = [getVector(element.pointO, element.pointX), getVector(element.pointO, element.pointY)]
        let axis = []
        for (let i = 0; i < vector.length; i++) {
          let x = vector[i][0]
          let y = vector[i][1]
          if (x !== 0) {
            axis.push([-y / x, 1])
          } else if (y !== 0) {
            axis.push([1, -x / y])
          } else {
            console.warn(element, '不存在含零向量的图形')
          }
        }
        return axis
      }
    }
    //获取圆形的分离轴
    let getArcAxis = (element, arc) => { }
    //判断点在分离轴上的投影，返回最大值和最小值
    let getProj = (rect, axis) => {
      let max = dot(getVector(rect.pointO, rect.pointX), axis)
      let min = max

      let arr = [dot(getVector(rect.pointX, rect.pointXY), axis), dot(getVector(rect.pointXY, rect.pointY), axis), dot(getVector(rect.pointY, rect.pointO), axis)]
      console.log('pointToPoint', pointToPoint(rect.pointX, rect.pointXY))
      console.log(rect)
      console.log('p', rect.pointX, rect.pointXY)
      console.log('v', getVector(rect.pointX, rect.pointXY))
      console.log('d', dot(getVector(rect.pointX, rect.pointXY), axis))
      for (let i = 0; i < 3; i++) {
        if (arr[i] > max) {
          max = arr[i]
        }
        if (arr[i] < min) {
          min = arr[i]

        }
      }
      return [min, max]
    }
    //如果是OBB矩形碰撞
    if (element1.hitType === 'Rect' || element2.hitType === 'Rect' && element1.hitType !== 'Arc') {
      let axis = getRectAxis(element1)
      for (let i = 0; i < axis.length; i++) {
        let ele1 = getProj(element1, axis[i])
        let ele2 = getProj(element2, axis[i])
        if (ele1[1] > ele2[0] && ele2[1] > ele1[0]) {
          return true
        }
      }

    }
  }

}






// 事件对象

/**
 * 鼠标相关的事件对象类
 */
class EMouseEvent {
  canvasX: number
  canvasY: number
  eventType: string
  eventName: string
  shape: MoveShape
  shapeName: string
  domEvent: object
  constructor(type: eventType, e: MouseEvent, that: ECanvas, i: number) {
    this.canvasX = e.clientX - that.canvas.getBoundingClientRect().left
    this.canvasY = e.clientY - that.canvas.getBoundingClientRect().top
    this.eventType = type
    this.eventName = ''
    this.shape = that.event[type][i]
    this.shapeName = that.event[type][i].name
    this.domEvent = e
  }
}

/**
 * 键盘相关事件对象
 */
class EKeyEvent {
  key: string
  code: string
  keyCode: number
  eventType: string
  eventName: string
  shapeName: string
  shape: MoveShape
  domEvent: KeyboardEvent
  constructor(type: eventType, e: KeyboardEvent, that: ECanvas, i: number) {
    this.key = e.key,
      this.code = e.code,
      this.keyCode = e.keyCode,
      this.eventType = type,
      this.eventName = '',
      this.shapeName = that.event[type][i].name,
      this.shape = that.event[type][i],
      this.domEvent = e
  }
}
export type hitType = 'AABB' | 'Arc' | 'Rect'
export type eventType = 'click' | 'keydown' | 'keyup' | 'mousedown' | 'mousemove' | 'mouseup'
