export class MessageEvent extends Error {
  constructor(name: string, message: string) {
    super(message);
    this.name = `[ ${name} ] error`;
  }
}

export class Message {
  private readonly errorName: string;
  private readonly level: 'warning' | 'error' | 'off';

  constructor(name?: string, level?: MessageLevel) {
    this.level = level || 'warning';
    this.errorName = name || 'Signature';
  }

  send(message: string, name?: string) {
    if (this.level === 'off') return;
    const error = new MessageEvent(name || this.errorName, message);
    if (this.level === 'warning') {
      console.log(error);
    } else if (this.level === 'error') {
      throw error;
    }
  }

  warn(message: string, name?: string) {
    if (this.level === 'off') return;
    console.warn('[ %s ] error: %s', name || this.errorName, message);
  }
}
