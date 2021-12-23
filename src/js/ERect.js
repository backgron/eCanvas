import MoveShape from "./MoveShape"

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
    //旋转中心点
    this.rotateM
    this.direction = 0

    //碰撞信息
    this.hitType

    //命名
    this.name = 'unnamed-ERect'

    //图片信息
    this.Image = new Image()
    this.imgIsLoad = false
    this.img
    this.imgs = []

    this.init()

  }
  //初始化信息
  init() {
    this.rotateM = 'leftTop'
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
        switch (this.rotateM) {
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
        switch (this.rotateM) {
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
        switch (this.rotateM) {
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
        switch (this.rotateM) {
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
        switch (this.rotateM) {
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
  rotate(direction, rotateM = 'middle') {
    this.direction = direction
    this.rotateM = rotateM
  }

  //设置图片的方法 
  initImage(imgs) {
    this.imgs = imgs
    let loadComplete = async (src) => {
      return new Promise((resolve) => {
        this.Image.src = src
        this.Image.onload = () => {
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

  //边缘检测
  isEdge() {

  }




  //绘画的方法
  draw(beforeDrow) {
    if (typeof beforeDrow === 'function') {
      beforeDrow()
    }
    if (this.imgIsLoad) {
      this.ctx.translate(this.pointO[0], this.pointO[1])
      this.ctx.rotate(this.direction)
      this.ctx.drawImage(this.Image, 0, 0)
      this.ctx.rotate(-this.direction)
      this.ctx.translate(-this.pointO[0], -this.pointO[1])
    }

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

export default ERect