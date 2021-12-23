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

    //事件信息
    this.eventType = {}

    //特征名称信息
    this.name = 'unnamed-MoveShape'

    //绘画的回调函数
    this.beforeDrow

    this.MoveShapeInit()
  }

  MoveShapeInit() {

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
  moveByKey(v = 3, key = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'], callback) {
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
  addEventListener(type, name, callback) {
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

  //移出事件
  removeEventListener(type, name) {
    this.eventType[type][name] = undefined
  }
}

export default MoveShape