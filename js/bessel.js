/**
 * 一阶辅助
 * @param { number } a
 * @param { number } b
 * @param { number } k 0 -> 1
 * @returns { number }
 */
const toFirstOrder = function (a, b, k) {
  return a + (b - a) * k;
}

/**
 * 二阶辅助
 * @param { number } a
 * @param { number } b
 * @param { number } c
 * @param { number } k 0 -> 1
 * @returns { number }
 */

function toSecondOrder (a, b, c, k) {
  const val = 1 - k;
  return val * val * a + 2 * k * val * b + k * k * c;
}

/**
 * 一阶贝塞尔
 * @param {{x:number,y:number}} p0
 * @param {{x:number,y:number}} p1
 * @param {number} k 0 ->> 1
 * @returns {{x: number, y: number}}
 */
const firstOrder = function (p0, p1, k) {
  return {x: toFirstOrder(p0.x, p1.x, k), y: toFirstOrder(p0.y, p1.y, k)};
}

/**
 * 二阶贝塞尔
 * @param {{x:number,y:number}} p0
 * @param {{x:number,y:number}} p1
 * @param {{x:number,y:number}} p2
 * @param {number} k 0 ->> 1
 * @returns {{x: number, y: number}}
 */
function secondOrder (p0, p1, p2, k) {
  return {x: toSecondOrder(p0.x, p1.x, p2.x, k), y: toSecondOrder(p0.y, p1.y, p2.y, k)};
}

/**
 * 一阶贝塞尔距离
 * @param {{x:number, y:number}} p0
 * @param {{x:number, y:number}} p1
 * @returns {number}
 * @constructor
 */
function firstOrderGenerate (p0, p1) {
  const [x, y] = [p0.x - p1.x, p0.y - p1.y];
  return Math.ceil(Math.sqrt(x * x + y * y));
}

/**
 * 二阶贝塞尔距离 - 伪
 * @param {{x:number, y:number}} p0
 * @param {{x:number, y:number}} p1
 * @param {{x:number, y:number}} p2
 * @returns {number}
 */
function secondOrderGenerate (p0, p1, p2) {
  return firstOrderGenerate(p0, p1) + firstOrderGenerate(p1, p2)
}
