import { Layer, CreateCanvasOptions, Point } from '@signature/types';
import { CursorMoveEvent } from '@signature/CursorMoveEvent';
import { LimitToRange, mergeOptions } from '@utils';

export class CreateCanvas extends CursorMoveEvent {
  private readonly ratio: number;
  private readonly doc: HTMLCanvasElement;
  private readonly opt: CreateCanvasOptions;
  // 当前笔画
  private readonly layer: Layer = [];
  // 历史笔画
  private readonly layers: Layer[] = [];

  // 初始化
  constructor(document: HTMLCanvasElement, options?: Partial<CreateCanvasOptions>) {
    const opt = mergeOptions<CreateCanvasOptions>({ delay: 500 }, options);
    super(document, opt.delay);
    this.opt = opt;
    this.doc = document;
    this.ratio = LimitToRange(window.devicePixelRatio, 2, Infinity);
    //
    this.doc.addEventListener('resize', this.onResize.bind(this));
  }

  // 设置画布大小以及样式
  private setCanvasAttribute() {
    const { offsetWidth, offsetHeight } = this.doc;
    this.doc.height = offsetHeight * this.ratio;
    this.doc.width = offsetWidth * this.ratio;
    this.doc.style.height = offsetHeight + 'px';
    this.doc.style.width = offsetWidth + 'px';
  }

  // 重新渲染画布
  private renderCanvas() {

  }

  // 画布调整
  public onResize() {
    this.setCanvasAttribute();
    this.renderCanvas();
  }

  // CursorMoveEvent 封装后必须实现的方法
  protected handleMouseMove(keys: 'set' | 'end', point?: Point) {
    //
  }
}
