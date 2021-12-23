import MoveShape from "./MoveShape"
/**可控圆形EArc
 * 
 * 
 */
class EArc extends MoveShape {
  constructor(x, y, radius, startAngle, endAngle, anticlockwise, style = 'fill', color = '#000') {
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

  draw(beforeDrow) {
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


export default EArc