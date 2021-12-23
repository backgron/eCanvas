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
//图形判断位置的方法
//点到点距离的平方
function pointToPoint(point1, point2) {
  return (point1[0] - point2[0]) * (point1[0] - point2[0]) + (point1[1] - point2[1]) * (point1[1] - point2[1])
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
    return (pointToPoint(linePoint1, point) - m * m / pointToPoint(linePoint2, linePoint1))
  }
}
//点是否在图形内
function pointInShape(point, shape) {
  if (shape.hitType === 'Arc') {
    if (pointToPoint(point, [shape.x, shape.y]) > shape.radius * shape.radius) {
      return false
    } else {
      return true
    }
  } else {
    let o = shape.pointO
    let x = shape.pointX
    let xy = shape.pointXY
    let y = shape.pointY
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
function isHit(element1, element2) {
  // AABB元素的碰撞检测
  if (element1.hitType === 'AABB' && element2.hitType === 'AABB') {
    // AABB（未旋转矩形）的碰撞检测
    let minX = Math.max(element1.pointO[0], element2.pointO[0])
    let minY = Math.max(element1.pointO[1], element2.pointO[1])
    let maxX = Math.min(element1.pointX[0], element2.pointX[0])
    let maxY = Math.min(element1.pointY[1], element2.pointY[1])
    if (minX < maxX && minY < maxY) {
      return true
    }
    return false
  }

  //圆形和圆形
  if (element1.hitType === 'Arc' && element2.hitType === 'Arc') {
    let d = pointToPoint([element1.x, element1.y], [element2.x, element2.y])
    let r = element1.radius * element1.radius + element2.radius * element2.radius
    if (d > r) {
      return false
    } else {
      return true
    }
  }

  //圆形和矩形
  if (((element1.hitType === 'AABB' || element1.hitType === 'Rect') && element2.hitType === 'Arc') || ((element2.hitType === 'AABB' || element2.hitType === 'Rect') && element1.hitType === 'Arc')) {
    let arc
    let rect
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
      let o = rect.pointO
      let x = rect.pointX
      let xy = rect.pointXY
      let y = rect.pointY
      let r = arc.radius * arc.radius

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
      let o = rect.pointO
      let x = rect.pointX
      let xy = rect.pointXY
      let y = rect.pointY
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
    let getArcAxis = (element, arc) => {}
    //判断点在分离轴上的投影，返回最大值和最小值
    let getProj = (rect, axis) => {
      let max = dot(getVector(rect.pointO, rect.pointX), axis)
      let min = max

      let arr = [dot(getVector(rect.pointX, rect.pointXY), axis), dot(getVector(rect.pointXY, rect.pointY), axis), dot(getVector(rect.pointY, rect.pointO), axis)]
      console.log('pointToPoint', pointToPoint(rect.pointX, rect.pointXY));
      console.log(rect);
      console.log('p', rect.pointX, rect.pointXY);
      console.log('v', getVector(rect.pointX, rect.pointXY));
      console.log('d', dot(getVector(rect.pointX, rect.pointXY), axis));
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
    if (element1.hitType === 'Rect' || element2.hitType === 'Rect' && element1.hitType !== 'Arc' && element2.hitType !== 'Arc') {
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

export default {
  getVector,
  dot,
  cross,
  pointToPoint,
  pointToLine,
  pointInShape,
  isHit,
  isEdge
}