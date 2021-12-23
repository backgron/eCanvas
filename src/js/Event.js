// 事件对象

/**
 * 鼠标相关的事件对象类
 */
class MouseEvent {
  constructor(type, e, that, i) {
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
class KeyEvent {
  constructor(type, e, that, i) {
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

export default {
  KeyEvent,
  MouseEvent
}