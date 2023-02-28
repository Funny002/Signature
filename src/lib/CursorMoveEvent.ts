export class CursorMoveEvent {
  private readonly handleFunc: any;
  private readonly dom: HTMLElement;
  private isDrawing: boolean = false;

  constructor(doc: HTMLElement, handle: CursorMoveEventHandle) {
    this.dom = doc;
    this.handleFunc = handle;
    doc.addEventListener('mouseup', this.onMouseUp.bind(this));
    doc.addEventListener('mouseout', this.onMouseOut.bind(this));
    doc.addEventListener('mousemove', this.onMouseMove.bind(this));
    doc.addEventListener('mousedown', this.onMouseDown.bind(this));
  }

  public unload() {
    this.dom.removeEventListener('mouseup', this.onMouseUp.bind(this));
    this.dom.removeEventListener('mouseout', this.onMouseOut.bind(this));
    this.dom.removeEventListener('mousemove', this.onMouseMove.bind(this));
    this.dom.removeEventListener('mousedown', this.onMouseDown.bind(this));
  }

  // 光标移动
  private onMouseMove(e: MouseEvent) {
    if (this.isDrawing) {
      this.handleFunc('set', [e.offsetX, e.offsetY]);
    }
  }

  // 按下鼠标左键
  private onMouseDown(e: MouseEvent) {
    if (e.button === 0) {
      this.isDrawing = true;
      this.handleFunc('set', [e.offsetX, e.offsetY]);
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
    this.handleFunc('end');
    this.isDrawing = false;
  }
}
