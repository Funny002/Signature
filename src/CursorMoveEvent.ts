import { throttle } from './utils';

export class CursorMoveEvent {
  private isDrawing: boolean = false;
  private readonly handleThrottle: (...args: any[]) => void;

  constructor(document: HTMLCanvasElement, delay = 300) {
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
    document.addEventListener('mouseout', this.onMouseOut.bind(this));
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.handleThrottle = throttle((...args: ['set' | 'end', Point]) => this.handleMouseMove(...args), delay);
  }

  // 光标移动
  private onMouseMove(e: MouseEvent) {
    if (this.isDrawing) {
      this.handleThrottle('set', [e.offsetX, e.offsetY]);
    }
  }

  // 按下鼠标左键
  private onMouseDown(e: MouseEvent) {
    if (e.button === 0) {
      this.isDrawing = true;
      this.handleThrottle('set', [e.offsetX, e.offsetY]);
    }
  }

  // 松开鼠标左键
  private onMouseUp(e: MouseEvent) {
    if (e.button === 0) { // 检查是否是左键
      this.handleMouseMove('end');
      this.isDrawing = false;
    }
  }

  // 光标移出画布
  private onMouseOut() {
    this.handleMouseMove('end');
    this.isDrawing = false;
  }

  // 处理方法，请继承该类后，覆盖掉
  protected handleMouseMove(keys: 'set' | 'end', point?: Point) {
    throw new Error(`请覆写该方法, (keys: 'set' | 'end', point?: Point)`);
  };
}
