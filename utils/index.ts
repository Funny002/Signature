// 配置项合并
export function mergeOptions<T = any>(...options: any[]): T {
  const result: any = {};
  for (const option of options) {
    if (typeof option === 'object' && option !== null) {
      for (const key of Object.keys(option)) {
        if (Array.isArray(option[key])) {
          result[key] = (result[key] || []).concat(option[key]);
        } else if (typeof option[key] === 'object' && option[key] !== null) {
          result[key] = mergeOptions(result[key] || {}, option[key]);
        } else {
          result[key] = option[key];
        }
      }
    }
  }
  return result;
}

// 节流 - 采用异步的方式
export function Throttle<T extends (...args: any[]) => void>(func: T, delay: number) {
  let state = false;
  return function (...args: any[]): void {
    if (state) return;
    state = true;
    func(args);
    setTimeout(() => state = false, delay);
  };
}

// 限制一个数在合理的范围
export function LimitToRange(num: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(num, max));
}
