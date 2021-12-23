import ECanvas from './ECanvas.js'
import MoveShape from './MoveShape.js'
import ERect from './ERect.js'
import EArc from './EArc.js'
import {
  MouseEvent,
  KeyEvent
} from './Event.js'
import {
  getVector,
  dot,
  cross,
  pointToPoint,
  pointToLine,
  pointInShape,
  isHit,
  isEdge
} from './util.js'


let canvas = document.querySelector(' #canvas')
let eCanvas = new ECanvas(canvas)
let rect = new ERect(100, 100, 100, 100)
eCanvas.toBind(rect)

let rect2 = new ERect(100, 100, 100, 100, 'fill', 'red')
eCanvas.toBind(rect2)
rect2.rotate(Math.PI / 4, 'leftTop')

// rect.zIndexSet(2)
eCanvas.draw()