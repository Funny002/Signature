// 一次贝塞尔
export function primaryBessel(p0: Point, p1: Point, t: number): Point {
  return [p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t];
}

// 二次贝塞尔辅助
function toSecondOrder(a: number, b: number, c: number, k: number) {
  const t = 1 - k;
  return t * t * a + 2 * k * t * b + k * k * c;
}

// 二次贝塞尔
export function quadraticBezier(p0: Point, p1: Point, p2: Point, t: number) {
  return [toSecondOrder(p0[0], p1[0], p2[0], t), toSecondOrder(p0[1], p1[1], p2[1], t)];
}

// 计算点与点的距离
export function getPointDistance(p0: Point, p1: Point): number {
  const [x, y] = [p0[0] - p1[0], p0[1] - p1[1]];
  return Math.ceil(Math.sqrt(x * x + y * y));
}

// 计算曲线的距离
export function getCurveDistance(p0: Point, p1: Point, p2: Point): number {
  return getPointDistance(p0, p1) + getPointDistance(p1, p2);
  // const ax = p0[0] - 2 * p1[0] + p2[0];
  // const ay = p0[1] - 2 * p1[1] + p2[1];
  // const bx = 2 * (p1[0] - p0[0]);
  // const by = 2 * (p1[1] - p0[1]);
  // const a = 4 * (ax * ax + ay * ay);
  // const b = 4 * (ax * bx + ay * by);
  // const c = bx * bx + by * by;
  // const sabc = 2 * Math.sqrt(a + b + c);
  // const a2 = Math.sqrt(a);
  // const a32 = 2 * a * a2;
  // const c2 = 2 * Math.sqrt(c);
  // const ba = b / a2;
  // return Math.ceil((a32 * sabc + a2 * b * (sabc - c2) + (4 * c * a - b * b) * Math.log((2 * a2 + ba + sabc) / (ba + c2))) / (4 * a32));
}
