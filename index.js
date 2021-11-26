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
  constructor(canvas) {
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

  }

  //向画布中挂载对象
  toBind(ele) {
    if (ele && !ele.bind) {
      ele.ctx = this.ctx
      ele.bind = true
      this.elements[ele.zIndex].push(ele)
    }
  }

  //解除挂载
  removeBind(ele) {
    if (ele) {
      ele.ctx = null
      ele.bind = false
    } else {
      console.warn(ele + '对象不存在');
    }
  }

  // 页面渲染入口
  drow() {
    let animate = () => {
      this.ctx.clearRect(0, 0, this.w, this.h)
      for (let i = 0; i < this.elements.length; i++) {
        for (let j = 0; j < this.elements[i].length; j++) {
          if (!this.elements[i][j].bind) {
            this.elements[i].splice(j, 1)
            continue
          }
          this.elements[i][j].drow()
        }
      }
      this.rafId.push(window.requestAnimationFrame(animate))
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
  }


  //初始化运动属性
  initMove(config) {
    if (config) {
      for (let key in config) {
        this[key] = config[key]
      }
    }
  }

  //开始按照属性运动
  move(callback) {
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
  moveTo(stopConfig, callback) {
    this.move()
    this.timeId.push(setInterval(() => {
      for (let key in stopConfig) {
        if (stopConfig[key] > this[key] - 2 * (this.Vx + this.Vy) && stopConfig[key] < this[key] + 2 * (this.Vx + this.Vy)) {
          this[key] = stopConfig[key]
          this.stop()
          if (callback) {
            callback();
          }
        }
      }
    }, 1))

  }

  //停止运动
  stop(callback) {
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
  moveByKey(v, key = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'], callback) {
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
  constructor(x, y, width, height, style = 'fill', color = '#000') {
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



    this.init()

  }
  //初始化信息
  init() {
    this.pointM = 'leftTop'
    this.setPoints()
    console.log(this);

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
  rotate(direction, pointM = 'middle') {
    this.direction = direction
    this.pointM = pointM
  }

  //绘画的方法
  drow() {
    this.ctx.beginPath();
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
  constructor(x, y, radius, startAngle, endAngle, direction, shape = 'fill', color = '#000') {
    this.x = x
    this.y = y
    this.radius = radius
    this.startAngle = startAngle
    this.endAngle = endAngle
    this.direction = direction
    this.shape = shape
    this.color = color
  }
}



//公用方法
//获取向量
function getVector(point1, point2) {
  return [point2[0] - point1[0], point2[1] - point1[1]]
}
//点乘向量
function dot(vector1, vector2) {
  return vector1[0] * vector2[0] + vector1[1] * vector2[1]
}
//叉乘向量
function cross(vector1, vector2) {
  return vector1[0] * vector2[1] - vector1[1] * vector2[0]
}

//点到线段的最短距离 平方
function pointToLine(point, linePoint1, linePoint2) {
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
    console.log(pointToPoint(linePoint1, point), m);
    return (pointToPoint(linePoint1, point) - m * m)

  }
}
//点到点距离的平方
function pointToPoint(point1, point2) {
  return (point1[0] - point2[0]) * (point1[0] - point2[0]) + (point1[1] - point2[1]) * (point1[1] - point2[1])
}

//碰撞检测
function isHit(element1, element2) {
  // AABB（未旋转矩形）的碰撞检测
  if (element1.hitType === 'AABB' && element2.hitType === 'AABB') {
    let minX = Math.max(element1.pointO[0], element2.pointO[0])
    let minY = Math.max(element1.pointO[1], element2.pointO[1])
    let maxX = Math.min(element1.pointX[0], element1.pointX[0])
    let maxY = Math.min(element1.pointY[1], element2.pointY[1])
    if (minX < maxX && minY < maxY) {
      return true
    }
    return false
  }
  //
}