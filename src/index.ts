import { handleDivElement, limitToRange } from './utils';
import { CursorMoveEvent } from './lib/CursorMoveEvent';
import { CanvasLayer } from './lib/CanvasLayer';
import { Message } from './lib/Message';

const defaultOptions: CreateCanvasOptions = { maxStack: 10, size: 2, delay: 30, soften: 0, distance: 10, optimize: 0.5, color: '#000000', ratio: window.devicePixelRatio };

export class CreateCanvas {
  private opt = defaultOptions;
  private readonly error = new Message();
  private readonly canvasLayers: CanvasLayer;
  private readonly cursorMoveEvent: CursorMoveEvent;

  constructor(element: string | HTMLDivElement, option?: Partial<CreateCanvasOptions>) {
    this.handleOptions(option || {});
    const div = handleDivElement(element);
    if (!div) throw new Error('请传入需要绑定的 div 元素');
    div.innerHTML = ''; // 清空内容
    div.style.padding = '0'; // 清空边距防止定位偏移
    div.style.position = 'relative'; // 添加定位
    // 画布托管
    this.canvasLayers = new CanvasLayer(div, this.opt);
    // 光标托管
    this.cursorMoveEvent = new CursorMoveEvent(div, this.canvasLayers, this.opt);
  }

  public undo() {
    this.canvasLayers.undoHistory();
  }

  public redo() {
    this.canvasLayers.redoHistory();
  }

  private handleOptions(option: Partial<CreateCanvasOptions>) {
    this.size = option.size || 2;
    this.delay = option.delay || 20;
    this.soften = option.soften || 0;
    this.color = option.color || '#000';
    this.maxStack = option.maxStack || 10;
    this.distance = option.distance || 10;
    this.optimize = option.optimize || 0.5;
    // 特殊的
    this.opt.ratio = option.ratio || 1;
  }

  get distance() {
    return this.opt.distance;
  }

  set distance(value: number) {
    if (value > 10) {
      this.error.warn('数值过大可能影响用户体验');
    }
    this.opt.distance = value;
    if (this.cursorMoveEvent) {
      this.cursorMoveEvent.delay = value;
    }
  }

  get delay() {
    return this.opt.delay;
  }

  set delay(value: number) {
    if (value > 100) {
      this.error.warn('数值过大可能影响用户体验');
    }
    this.opt.delay = value;
    if (this.cursorMoveEvent) {
      this.cursorMoveEvent.delay = value;
    }
  }

  get soften() {
    return this.opt.soften;
  }

  set soften(value: number) {
    if (value > 100 || value < 0) {
      this.error.send(`数值超出规定的范围：${value}`);
    }
    this.opt.soften = value;
  }

  get maxStack() {
    return this.opt.maxStack;
  }

  set maxStack(value: number) {
    if (value > 50) {
      this.error.warn(`最大栈过大可能影响到你的使用`);
    }
    this.opt.maxStack = value;
  }

  get size() {
    return this.opt.size;
  }

  set size(value: number) {
    if (value > 1000 || value < 1) {
      this.error.send(`数值超出规定的范围：${value}`);
    }
    this.opt.size = limitToRange(value, 1, 1000);
  }

  get color() {
    return this.opt.color;
  }

  set color(value: string) {
    if (!/^#([0-9a-f]{3}|[0-9a-f]{6}([0-9a-f]{2})?)$/i.test(value)) {
      this.error.send('请输入十六进制的颜色字符串');
    }
    this.opt.color = value;
  }

  get optimize() {
    return this.opt.optimize;
  }

  set optimize(value: number) {
    if (value > 1 || value < 0) {
      this.error.send(`数值超出规定的范围：${value}`);
    }
    this.opt.optimize = limitToRange(value, 0, 1);
  }
}
