import { throttle } from '../utils';

export class CursorMoveEvent {
  private readonly handleFunc: any;
  private readonly dom: HTMLElement;
  private isDrawing: boolean = false;
  private handleThrottleFunc: (...args: any[]) => void;

  // 初始化
  constructor(doc: HTMLElement, handle: CursorMoveEventHandle, delay: number) {
    this.dom = doc;
    this.handleFunc = handle;
    doc.addEventListener('mouseup', this.onMouseUp.bind(this));
    doc.addEventListener('mouseout', this.onMouseOut.bind(this));
    doc.addEventListener('mousemove', this.onMouseMove.bind(this));
    doc.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.handleThrottleFunc = throttle((...args: ['set' | 'end', Point]) => handle(...args), delay);
  }

  // 调整节流
  set setDelay(value: number) {
    this.handleThrottleFunc = throttle((...args: ['set' | 'end', Point]) => this.handleFunc(...args), value);
  }

  // 卸载监听器
  public unload() {
    this.dom.removeEventListener('mouseup', this.onMouseUp.bind(this));
    this.dom.removeEventListener('mouseout', this.onMouseOut.bind(this));
    this.dom.removeEventListener('mousemove', this.onMouseMove.bind(this));
    this.dom.removeEventListener('mousedown', this.onMouseDown.bind(this));
  }

  // 光标移动
  private onMouseMove(e: MouseEvent) {
    if (this.isDrawing) {
      this.handleThrottleFunc('set', [e.offsetX, e.offsetY]);
    }
  }

  // 按下鼠标左键
  private onMouseDown(e: MouseEvent) {
    if (e.button === 0) {
      this.isDrawing = true;
      this.handleThrottleFunc('set', [e.offsetX, e.offsetY]);
    }
  }

  // 松开鼠标左键
  private onMouseUp(e: MouseEvent) {
    if (e.button === 0) { // 检查是否是左键
      this.handleFunc('end');
      this.isDrawing = false;
    }
  }

  // 光标移出画布
  private onMouseOut() {
    if (this.isDrawing) {
      this.handleFunc('end');
      this.isDrawing = false;
    }
  }
}
