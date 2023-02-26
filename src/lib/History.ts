export class History<T extends { type: string, payload?: any }> {
  private stack: T[] = [];
  private current: number = -1;
  private maxStackSize: number = 10;
  private listeners: ((stack: T[], current: number) => void)[] = [];

  // 初始化
  constructor(maxSize?: number) {
    this.maxStackSize = maxSize || 10;
  }

  // 添加动作
  public addAction(action: T): void {
    this.stack.splice(this.current + 1);
    this.stack.push(action);
    this.current++;
    if (this.stack.length > this.maxStackSize) {
      this.stack.shift();
      this.current--;
    }
    this.emitChange();
  }

  // 撤销
  public undo(): void {
    if (this.current < 0) {
      return;
    }
    this.current--;
    this.emitChange();
  }

  // 重做
  public redo(): void {
    if (this.current >= this.stack.length - 1) {
      return;
    }
    this.current++;
    this.emitChange();
  }

  // 是否可以撤销
  public canUndo(): boolean {
    return this.current >= 0;
  }

  // 是否可以重做
  public canRedo(): boolean {
    return this.current < this.stack.length - 1;
  }

  // 设置最大栈
  public setMaxStackSize(size: number): void {
    this.maxStackSize = size;
  }

  // 添加监听器
  public addListener(listener: (stack: T[], current: number) => void): void {
    this.listeners.push(listener);
  }

  // 移除监听器
  public removeListener(listener: (stack: T[], current: number) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  // 自定义动作
  public customAction(payload?: any): void {
    const action = { type: 'custom', payload } as T;
    this.addAction(action);
  }

  // 执行动作
  private emitChange(): void {
    this.listeners.forEach(listener => listener(this.stack, this.current));
  }
}
