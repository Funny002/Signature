// 计算方法
export function calculateCoefficients(n: number, t: number): number[] {
  const result = new Array(n + 1);
  const u = 1 - t;
  let current = u ** n;
  result[0] = current;
  for (let i = 1; i <= n; i++) {
    current *= t / u;
    result[i] = current;
  }
  return result;
}

// 一次贝塞尔
function primaryBessel(p0: Point, p1: Point, t: number): Point {
  return [p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t];
}

// 二次贝塞尔
export function quadraticBezier(p0: Point, p1: Point, p2: Point, t: number): Point {
  const [cu, ct, uu] = calculateCoefficients(2, t);
  const u = 1 - t;
  const x = cu * p0[0] + ct * 2 * u * p1[0] + uu * p2[0];
  const y = cu * p0[1] + ct * 2 * u * p1[1] + uu * p2[1];
  return [x, y];
}

// 三次贝塞尔
export function cubicBezier(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const [cu, ct1, ct2, uu] = calculateCoefficients(3, t);
  const u = 1 - t;
  const x = cu * p0[0] + ct1 * 3 * u * p1[0] + ct2 * 3 * u * u * p2[0] + uu * p3[0];
  const y = cu * p0[1] + ct1 * 3 * u * p1[1] + ct2 * 3 * u * u * p2[1] + uu * p3[1];
  return [x, y];
}

// 计算点与点的距离
export function getPointDistance(p0: Point, p1: Point): number {
  return Math.ceil(Math.sqrt((p0[0] - p1[0]) ^ 2 + (p0[1] - p1[1]) ^ 2));
}
