const Ratio = 2; // 画布固定为 2
let view, Canvas;
$(function () {
  /*  画板  */
  view = $('#canvas');
  const {offsetWidth, offsetHeight} = view;
  view.setAttribute('width', offsetWidth * Ratio + 'px');
  view.setAttribute('height', offsetHeight * Ratio + 'px');
  Canvas = view.getContext('2d');
  /*  方法监听  */
  // 按下
  view.addEventListener('mousedown', e => toSize(e, startFunc));
  // 移出
  view.addEventListener('mouseout', e => toSize(e, exitFunc));
  // 弹起
  view.addEventListener('mouseup', e => toSize(e, exitFunc));
})
let state = false
// 测试最低 0.3
let drawSize = SizeLimit(10, Infinity, 0.3)

/**
 *
 * @param {*} event
 * @param {({y:number, x:number}) => void} func
 */
function toSize (event, func) {
  const {layerY, layerX} = event
  func({
    t: new Date().getTime(),
    y: SizeLimit(layerY * Ratio, Infinity, 0),
    x: SizeLimit(layerX * Ratio, Infinity, 0)
  })
}

let lestPoint

function startFunc (Point) {
  state = true
  lestPoint = Point
  DrawPoint(Canvas, Point, drawSize)
  console.log('startFunc ->>', Point)
  view.addEventListener('mousemove', moveFunc)
}

function exitFunc (Point) {
  if (state) {
    state = false
    lestPoint = null
    DrawPoint(Canvas, Point, drawSize)
    // console.log('exitFunc ->>', Point)
    view.removeEventListener('mousemove', moveFunc)
  }
}

// 移动
function moveFunc (event) {
  toSize(event, function (Point) {
    if (!lestPoint) {
      DrawPoint(Canvas, Point, drawSize)
    } else {
      DrawPointLine(lestPoint, Point, function (valPoint) {
        DrawPoint(Canvas, valPoint, drawSize)
      })
    }
    lestPoint = Point
  })
}
