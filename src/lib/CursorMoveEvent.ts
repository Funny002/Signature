import { throttle } from '../utils';
import { getPointDistance } from '../utils/Bessel';
import { CanvasLayer } from './CanvasLayer';

export class CursorMoveEvent {
  private current?: Point;
  private __distance: number;
  private readonly handleFunc: any;
  private readonly dom: HTMLElement;
  private isDrawing: boolean = false;
  private handleThrottleFunc: (...args: any[]) => void;

  // 初始化
  constructor(doc: HTMLElement, canvasLayer: CanvasLayer, options: CursorMoveEventOptions) {
    this.dom = doc;
    this.__distance = options.distance;
    this.handleFunc = canvasLayer.handleMoveEvent.bind(canvasLayer);
    doc.addEventListener('mouseup', this.onMouseUp.bind(this));
    doc.addEventListener('mouseout', this.onMouseOut.bind(this));
    doc.addEventListener('mousemove', this.onMouseMove.bind(this));
    doc.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.handleThrottleFunc = throttle(this.handlePointFunc.bind(this), options.delay);
  }

  set distance(value: number) {
    this.__distance = value;
  }

  // 调整节流
  set delay(value: number) {
    this.handleThrottleFunc = throttle(this.handlePointFunc.bind(this), value);
  }

  private handlePointFunc(keys: 'set' | 'end', point: Point) {
    if (keys === 'end') {
      this.handleFunc('end', []);
    } else {
      // 过滤掉太近的坐标
      const { current, __distance } = this;
      const t = current ? getPointDistance(current, point) : Infinity;
      if (t > __distance) {
        this.current = point;
        this.handleFunc('set', point);
      }
    }
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
      this.handleFunc('end', []);
      this.isDrawing = false;
    }
  }

  // 光标移出画布
  private onMouseOut() {
    if (this.isDrawing) {
      this.handleFunc('end', []);
      this.isDrawing = false;
    }
  }
}
