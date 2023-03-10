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
  private lastPoint?: Point;
  private recordPoint?: Point;
  // 历史
  private history: string[] = [];
  private maxStackSize: number = 10;
  private historyCurrent: number = -1;

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
    this.divDom.addEventListener('resize', this.resize.bind(this));
    this.canvasCxt = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.backdropCxt = this.backdrop.getContext('2d') as CanvasRenderingContext2D;
  }

  private resize() {
    const { divDom: { offsetWidth, offsetHeight }, __ratio } = this;
    const [width, height] = [offsetWidth * __ratio, offsetHeight * __ratio];
    this.backdrop.height = height;
    this.backdrop.width = width;
    this.canvas.height = height;
    this.canvas.width = width;
    this.renderCanvas();
  };

  private handleBase64Png(base64: string) {
    return new Promise<HTMLImageElement>(success => {
      const img = new Image();
      img.src = base64;
      img.onload = () => success(img);
    });
  }

  public handleMoveEvent(keys: 'set' | 'end', point: Point) {
    if (keys === 'set') {
      if (!this.lastPoint) {
        this.drawPoint(point, this.opt.size);
      } else {
        this.drawCurve(this.lastPoint, point);
      }
      this.lastPoint = point;
    } else {
      // 处理数据并添加到历史
      this.handleAddHistory();
      this.lastPoint = undefined;
      this.recordPoint = undefined;
    }
  }

  // 绘画曲线
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

  // 处理画布
  private async handleAddHistory() {
    const img = await this.handleBase64Png(this.canvas.toDataURL('png'));
    this.canvas.width = this.canvas.width;
    this.backdropCxt.drawImage(img, 0, 0, img.width, img.height);
    this.addHistory(this.backdrop.toDataURL('png'));
  }

  // 添加历史
  private addHistory(base64Png: string) {
    this.history.splice(this.historyCurrent + 1);
    this.history.push(base64Png);
    this.historyCurrent++;
    if (this.history.length > this.maxStackSize) {
      this.history.shift();
      this.historyCurrent--;
    }
  }

  // 重做
  public redoHistory() {
    if (this.historyCurrent < this.history.length - 1) {
      this.historyCurrent++;
      console.log(this.historyCurrent, this.history.length);
      this.renderCanvas();
    }
  }

  // 回退
  public undoHistory() {
    if (this.historyCurrent >= 0) {
      this.historyCurrent--;
      this.renderCanvas();
    }
  }

  // 重绘
  private async renderCanvas() {
    const image = await this.handleBase64Png(this.history[this.historyCurrent]);
    this.backdrop.width = this.backdrop.width;
    this.backdropCxt.drawImage(image, 0, 0, image.width, image.height);
  }
}
