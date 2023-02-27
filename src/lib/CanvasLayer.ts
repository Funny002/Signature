// 画布图层
export class CanvasLayer {
  private stackMaxSize: number;
  private readonly stack: { layer: Point[], image: string }[] = [];
  private current: number = -1;

  constructor(maxSize?: number) {
    this.stackMaxSize = maxSize || 10;
  }

  set maxSize(value: number) {
    this.stackMaxSize = value;
  }

  public add(layer: Point[]) {
    // 如果撤销只能进行重做
    this.stack.splice(this.current + 1);
    this.current++;
  }
}
