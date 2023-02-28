// 配置项合并
export function mergeOptions<T = any>(defaultOptions: T, ...options: any[]): T {
  const result: any = defaultOptions;
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
export function throttle<T extends (...args: any[]) => void>(func: T, delay: number) {
  let state = false;
  return function (...args: any[]): void {
    if (state) return;
    state = true;
    func(...args);
    setTimeout(() => state = false, delay);
  };
}

// 限制一个数在合理的范围
export function limitToRange(num: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(num, max));
}


export function createCanvas(width: number, height: number, ratio: number, absolute?: boolean) {
  const canvas = document.createElement('canvas');
  // 外观大小
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.pointerEvents = 'none'; // 画布穿透
  if (absolute) {
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.position = 'absolute';
  }
  // 输出
  return canvas;
}

// 要求适用div作为容器包裹画布
export function handleDivElement(element: HTMLDivElement | string): HTMLDivElement | null {
  let dom = typeof element === 'string' ? document.querySelector(element) as HTMLDivElement : element;
  if (dom.tagName === 'DiV') return dom;
  return null;
}
