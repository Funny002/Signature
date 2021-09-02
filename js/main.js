const Ratio = 2;
///////////////////////////////////////////////////////////////////////////
let view, Canvas, DrawPoint;
let DrawSizeMax, DrawSizeMin, DrawSizeLink;
///////////////////////////////////////////////////////////////////////////
let Curve = 0.5;
let DrawColor = '#000000';
let Point0, Point0_0, Point0_1;
///////////////////////////////////////////////////////////////////////////
$(function () {
  view = $('#canvas');
  const {offsetWidth, offsetHeight} = view;
  view.setAttribute('width', offsetWidth * Ratio + 'px');
  view.setAttribute('height', offsetHeight * Ratio + 'px');
  Canvas = view.getContext('2d');
  setSize(5)
  serCtx(Canvas)
  /*  方法监听  */
  // 按下
  view.addEventListener('mousedown', startFunc);
  // 移出
  view.addEventListener('mouseout', exitFunc);
  // 弹起
  view.addEventListener('mouseup', exitFunc);
  ///////////////////////////////////////////////////////////////////////////
  $('.tabBar-list > .color').onchange = function ({target: {value: color}}) {
    DrawColor = color
  }
  $('.tabBar-list > .curve').onchange = function ({target}) {
    let v = parseFloat(target.value)
    v = SizeLimit(isNaN(v) ? Curve : v, 0.5, 0.1)
    target.value = v.toString()
    Curve = v
  }
  $('.tabBar-list > .size').onchange = function ({target}) {
    let v = parseFloat(target.value)
    v = SizeLimit(v, Infinity, 0.3)
    target.value = v.toString()
    setSize(v)
  }
})

////////////////////////////////////////////////////////////////////
function setSize (size) {
  DrawSizeMax = size
  DrawSizeMin = SizeLimit(DrawSizeMax / DrawSizeMax / 2, Infinity, 0.3)
  DrawSizeLink = DrawSizeMax
}

function serCtx (context) {
  DrawPoint = function (point, size, func = undefined) {
    context.beginPath();
    context.arc(point.x, point.y, size, 0, 2 * Math.PI, true)
    context.fillStyle = DrawColor
    if (func) func(context)
    context.fill()
    context.closePath();
  }
}

function DrawSize (s) {
  return SizeLimit(isNaN(s) ? 0 : s, DrawSizeMax, DrawSizeMin)
}

///////////////////////////////////////////////////////////////////////////
function DrawPointLine (p0, p1, s) {
  const count = firstOrderGenerate(p0, p1)
  const hasSize = DrawSizeLink
  const t = 1 / count
  for (let i = 0; i <= count; i++) {
    DrawSizeLink = DrawSize(hasSize + (s * t * i))
    DrawPoint(firstOrder(p0, p1, SizeLimit(t * i, 1, 0)), DrawSizeLink)
  }
}

function DrawPointCurve (p0, p1, p2, s) {
  const count = secondOrderGenerate(p0, p1, p2)
  const hasSize = DrawSizeLink
  const t = 1 / count
  for (let i = 0; i <= count; i++) {
    DrawSizeLink = DrawSize(hasSize + (s * t * i))
    DrawPoint(secondOrder(p0, p1, p2, SizeLimit(t * i, 1, 0)), DrawSizeLink)
  }
}

///////////////////////////////////////////////////////////////////////////
function toPoint ({layerY, layerX}) {
  return {
    t: new Date().getTime(),
    y: SizeLimit(layerY * Ratio, Infinity, 0),
    x: SizeLimit(layerX * Ratio, Infinity, 0)
  }
}

///////////////////////////////////////////////////////////////////////////
let FuncState = false

function startFunc (event) {
  AddPoint(event)
  FuncState = true
  view.addEventListener('mousemove', moveFunc)
}

function exitFunc (event) {
  if (FuncState) {
    AddPoint(event)
    FuncState = false
    DrawSizeLink = DrawSizeMax
    Point0 = Point0_0 = Point0_1 = null;
    view.removeEventListener('mousemove', moveFunc)
  }
}

///////////////////////////////////////////////////////////////////////////
const throttleTimeout = 10
const moveFunc = Throttle(AddPoint, throttleTimeout)

///////////////////////////////////////////////////////////////////////////
function AddPoint (event) {
  const p1 = toPoint(event);
  if (!Point0) {
    DrawPoint(p1, DrawSizeMin);
  } else {
    ////////////////////////////// 是我太菜了，暂不知道用什么计算
    const distance = firstOrderGenerate(Point0, p1);
    let difS = distance / 100
    difS = SizeLimit(difS > 1 ? -difS * 2 : difS, Infinity, -(DrawSizeMax / DrawSizeMax))
    ////////////////////////////// 是我太菜了，暂不知道用什么计算
    const p0_1 = firstOrder(Point0, p1, 1 - Curve);
    const p0_0 = Curve === 0.5 ? p0_1 : firstOrder(Point0, p1, Curve);
    if (!Point0_1) {
      DrawPointLine(Point0, p0_1, difS)
    } else {
      DrawPointCurve(Point0_1, Point0, p0_0, difS)
      if (Curve !== 0.5) DrawPointLine(p0_0, p0_1, difS)
    }
    [Point0_0, Point0_1] = [p0_0, p0_1];
  }
  Point0 = p1;
}
