import { getCurveDistance, getPointDistance, primaryBessel, quadraticBezier } from '../utils/Bessel';
import { createCanvas } from '../utils';

export class CanvasLayer {
  private __ratio: number;
  private readonly divDom: HTMLDivElement;
  private readonly opt: CanvasLayerOptions;
  private readonly canvas: HTMLCanvasElement;
  private readonly backdrop: HTMLCanvasElement;
  private canvasCxt: CanvasRenderingContext2D;
  private backdropCxt: CanvasRenderingContext2D;
  //
  private points: Point[] = [];
  private recordPoint?: Point;
  private lastPoint?: Point;

  constructor(dom: HTMLDivElement, option: CanvasLayerOptions) {
    this.opt = option;
    this.divDom = dom;
    this.__ratio = option.ratio;
    const { offsetWidth, offsetHeight } = this.divDom;
    this.backdrop = createCanvas(offsetWidth, offsetHeight, option.ratio);
    this.canvas = createCanvas(offsetWidth, offsetHeight, option.ratio, true);
    this.divDom.append(this.backdrop, this.canvas);
    // 容器大小变化
    this.resize();
    this.divDom.addEventListener('resize', this.resize);
    //
    this.canvasCxt = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.backdropCxt = this.backdrop.getContext('2d') as CanvasRenderingContext2D;
  }

  public resize() {
    const { divDom: { offsetWidth, offsetHeight }, __ratio } = this;
    const [width, height] = [offsetWidth * __ratio, offsetHeight * __ratio];
    this.backdrop.height = height;
    this.backdrop.width = width;
    this.canvas.height = height;
    this.canvas.width = width;
  };


  public handleMoveEvent(keys: 'set' | 'end', point: Point) {
    if (keys === 'set') {
      if (!this.lastPoint) {
        this.drawPoint(point, this.opt.size);
      } else {
        this.drawCurve(this.lastPoint, point);
      }
      this.lastPoint = point;
      // 原始数据数据
      this.points.push(point);
    } else {
      this.points = [];
      this.lastPoint = undefined;
      this.recordPoint = undefined;
    }
  }

  private drawCurve(last: Point, present: Point) {
    const { optimize, size } = this.opt;
    const record = primaryBessel(last, present, optimize); // a1
    const lastRecord = this.recordPoint;
    // 初始线
    if (!lastRecord) {
      const long = getPointDistance(last, record);
      for (let i = 0, t = 1 / long; i < long; i++) { // 绘画
        this.drawPoint(primaryBessel(last, record, t * i), size);
      }
    } else {
      const long = getCurveDistance(lastRecord, last, record);
      for (let i = 0, t = 1 / long; i < long; i++) { // 绘画
        this.drawPoint(quadraticBezier(lastRecord, last, record, t * i), size);
      }
    }
    this.recordPoint = record; // a0
  }

  // 绘画一个点
  private drawPoint(point: Point, size: number) {
    const { color, soften } = this.opt;
    this.canvasCxt.beginPath();
    this.canvasCxt.arc(point[0], point[1], size, 0, 2 * Math.PI, true);
    if (soften) {
      const gradient = this.canvasCxt.createRadialGradient(point[0], point[1], 0, point[0], point[1], size);
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      gradient.addColorStop(1 - soften, color);
      this.canvasCxt.fillStyle = gradient;
    } else {
      this.canvasCxt.fillStyle = color;
    }
    this.canvasCxt.fill();
    this.canvasCxt.closePath();
  }
}
