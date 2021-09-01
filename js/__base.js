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
 *
 * @param { Number } val
 * @param { Number } max
 * @param { Number } min
 * @returns { Number }
 */
function SizeLimit (val, max, min) {
  return Math.min(Math.max(val, min), max)
}
