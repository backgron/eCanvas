/**eCanvas 入口类
 * eCanvas 入口类
 *  属性：
 *    canvas：DOM 树中的 canvas 元素
 *    ctx：canvas 对应的上下文对象
 *    element：canvas 索要渲染的所有对象
 *    timeId: ECanvas 下所有定时器的 ID
 *    rafID：ECanvas 下所有请求动画关键帧的ID
 * 
 *  */
class ECanvas {
  constructor(canvas) {
    this.canvas = canvas
    this.w = canvas.width
    this.h = canvas.height
    this.ctx = this.getCtx()
    this.elements = []
    this.timeId = []
    this.rafId = []
  }

  //获取上下文对象
  getCtx() {
    if (this.canvas.getContext) {
      return this.canvas.getContext('2d')
    } else {
      console.error('您的浏览器不支持 "<canvas>" 标签')
    }
  }

  //向画布中挂在对象
  toBind(ele) {
    ele.ctx = this.ctx
    this.elements.push(ele)
  }

  // 页面渲染入口
  drow() {
    let animate = () => {
      this.ctx.clearRect(0, 0, this.w, this.h)
      for (let i = 0; i < this.elements.length; i++) {
        this.elements[i].drow()
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
 * 
*/
class MoveElement {
  constructor(Mx = 0, My = 0, Vx = 0, Vy = 0, Fx = 0, Fy = 0, m = 1) {
    this.Mx = Mx
    this.My = My
    this.Vx = Vx
    this.Vy = Vy
    this.Fx = Fx
    this.Fy = Fy
    this.m = m
    this.timeId = []
    this.rafId = []
  }

  //初始化运动属性
  initMove(config) {
    if (config) {
      for (let key in config) {
        this[key] = config[key]
      }
    }
    if (this instanceof ERect && this.Mx === 0 && this.My === 0) {
      this.Mx = this.x + (this.w) / 2
      this.My = this.y + (this.y) / 2
    } else if (this instanceof EArc) {
      this.Mx = this.r
      this.My = this.r
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
      console.log('moveto');
      for (let key in stopConfig) {
        if (stopConfig[key] > this[key] - 10 && stopConfig[key] < this[key] + 10) {
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
  moveByKey(v, callback) {
    if (callback) {
      callback()
    }
    window.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowUp':
          this.Vy = -v
          break
        case 'ArrowDown':
          this.Vy = v
          break
        case 'ArrowLeft':
          this.Vx = -v
          break
        case 'ArrowRight':
          this.Vx = v
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
 * 
 */
class ERect extends MoveElement {
  constructor(x, y, w, h, shape = 'fill', color = '#000') {
    super()
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.shape = shape
    this.color = color
    this.ctx = null
  }

  drow() {
    if (this.shape === 'fill') {
      this.ctx.fillStyle = this.color
      this.ctx.fillRect(this.x, this.y, this.w, this.h)
    } else if (this.shape === 'storke') {
      this.ctx.storkeStyle = this.color
      this.ctx.storkeRect(this.x, this.y, this.w, this.h)
    }
  }
}

/**可控圆形EArc
 * 
 * 
 */
class EArc extends MoveElement {
  constructor() {

  }
}

/**碰撞检测 */
class IsHit {

}