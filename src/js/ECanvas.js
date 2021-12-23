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
    this.event = {
      click: [],
      keydown: [],
      keyup: [],
      mousedown: [],
      mousemove: [],
      mouseup: [],
    }
    this.eventType = {}
    this.bind = true

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
  toBind(ele) {
    if (ele && !ele.bind) {
      ele.ctx = this.ctx
      ele.bind = this
      this.elements[ele.zIndex].push(ele)
    }

  }

  //添加事件元素
  bindEvent(ele) {
    for (let event in ele.eventType) {
      if (this.event[event].indexOf(ele) === -1) {
        this.event[event].push(ele)
      }
    }
  }

  //移出事件绑定
  removeEvent() {}

  //解除挂载
  removeBind(ele) {
    ele.stop()
    if (ele) {
      ele.ctx = null
      ele.bind = false
      console.log('remove')
    } else {
      console.warn(ele + '对象不存在');
    }
  }

  //执行事件代理 
  doEvent() {
    //创建鼠标事件的方法
    let createMouseEvent = (type, e) => {
      for (let i = 0; i < this.event[type].length; i++) {
        if (!this.event[type][i].bind) {
          this.event[type].splice(i, 1)
          i--
          continue
        }
        //创建点击事件的事件对象
        let event = new MouseEvent(type, e, this, i);
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
      createMouseEvent('click', e)
    })
    //鼠标按下事件
    this.canvas.addEventListener('mousedown', (e) => {
      createMouseEvent('mousedown', e)
    })
    //鼠标抬起事件
    this.canvas.addEventListener('mouseup', (e) => {
      createMouseEvent('mouseup', e)
    })
    //鼠标移动事件
    this.canvas.addEventListener('mousemove', (e) => {
      createMouseEvent('mousemove', e)
    })

    //创建键盘相关事件的方法
    let createKeyEvent = (type, e) => {
      for (let i = 0; i < this.event[type].length; i++) {
        let event = new KeyEvent(type, e, this, i)
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
      createKeyEvent('keydown', e)
    })
    //键盘抬起事件
    window.addEventListener('keyup', (e) => {
      createKeyEvent('keyup', e)
    })
  }

  //预删除
  preRemoveBind(arr, removeFun, clearFun) {
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
  addEventListener(type, name, callback) {
    if (this.eventType[type] === undefined) {
      this.eventType[type] = {}
      this.eventType[type][name] = callback
    } else {
      this.eventType[type][name] = callback
    }
    this.bindEvent(this)
  }

  //移出事件
  removeEventListener(type, name) {
    this.eventType[type][name] = undefined
  }
  // 页面渲染入口
  draw(callback) {
    let rafId
    let animate = () => {
      this.ctx.clearRect(0, 0, this.w, this.h)
      for (let i = 0; i < this.elements.length; i++) {
        for (let j = 0; j < this.elements[i].length; j++) {
          if (!this.elements[i][j].bind) {
            this.elements[i].splice(j, 1)
            j--
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

export default ECanvas