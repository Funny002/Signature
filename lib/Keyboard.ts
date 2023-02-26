const keyMap = ['ControlLeft', 'ControlRight', 'ShiftLeft', 'ShiftRight', 'AltLeft', 'AltRight', 'MetaLeft', 'MetaRight'];

class Keyboard {
  private shortcuts: { [shortcut: string]: Function } = {};
  private shortcutKey: { [key: string]: boolean } = {};

  // 初始化
  constructor(document: HTMLElement) {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  // 绑定
  public bind(shortcut: string, callback: Function): void {
    this.shortcuts[shortcut] = callback;
  }

  // 键盘按下
  private handleKeyDown(event: KeyboardEvent): void {
    if (this.isSupportedKey(event.code)) {
      this.shortcutKey[event.code] = true;
    }
    const shortcut = this.getPressedShortcut();
    if (shortcut && this.shortcuts[shortcut]) {
      event.preventDefault();
    }
  }

  // 键盘弹起
  private handleKeyUp(event: KeyboardEvent): void {
    if (this.isSupportedKey(event.code)) {
      this.shortcutKey[event.code] = false;
    }
    const shortcut = this.getPressedShortcut();
    if (shortcut && this.shortcuts[shortcut]) {
      this.shortcuts[shortcut]();
    }
  }

  // 按键检测
  private isSupportedKey(key: string): boolean {
    return keyMap.indexOf(key) !== -1 || !key.match(/^Key/);
  }

  // 获取按键
  private getPressedShortcut(): string {
    const pressedKeys: string[] = [];
    for (const key in this.shortcutKey) {
      if (this.shortcutKey[key]) {
        pressedKeys.push(key);
      }
    }
    const sortedKeys = pressedKeys.sort();
    return sortedKeys.join('+');
  }
}
