/**
 * 个人习惯
 * @param element
 * @returns {*[]|Element|*[]}
 */
function $ (element) {
  if (typeof element === 'string') {
    const domList = document.querySelectorAll(element);
    if (!domList.length) return [];
    return domList.length === 1 ? domList.item(0) : [].concat(domList);
  } else if (typeof element === 'function') {
    window.addEventListener('load', element);
  }
}

/**
 * 节流
 * @param { Function } func
 * @param { Number } timeout
 * @returns { (...arg:[*]) => void }
 * @constructor
 */
function Throttle (func, timeout = 1) {
  let state = false
  return function (...arg) {
    if (!state) {
      state = true
      func(...arg)
      setTimeout(() => {
        state = false
      }, timeout)
    }
  }
}

/**
 * 防抖
 * @param { Function } func
 * @param { Number } timeout
 * @returns { (...arg:[*]) => void }
 * @constructor
 */
function Debounce (func, timeout = 1) {
  let state = undefined
  return function (...arg) {
    if (state !== undefined) clearTimeout(state)
    state = setTimeout(() => {
      state = undefined
      func(...arg)
    }, timeout)
  }
}

/**
 *
 * @param { Number } val
 * @param { Number } max
 * @param { Number } min
 * @returns { Number }
 */
function SizeLimit (val, max, min) {
  return Math.min(Math.max(val, min), max)
}

/**
 *
 * @param { CanvasRenderingContext2D } context
 * @param { {x:Number, y:Number} } p0
 * @param { number } size
 * @param { (CanvasRenderingContext2D) => void } func
 */
function DrawPoint (context, p0, size = 2, func = undefined) {
  // const diff = (size / 2)
  context.beginPath();
  context.arc(p0.x, p0.y, size, 0, 2 * Math.PI, true)
  context.fillStyle = '#000'
  if (func) func(context)
  context.fill()
  context.closePath();
}

function DrawPointLine (p0, p1, func) {
  const count = firstOrderGenerate(p0, p1)
  const t = 1 / count
  for (let i = 0; i <= count; i++) {
    func(firstOrder(p0, p1, SizeLimit(t * i, 1, 0)))
  }
}
