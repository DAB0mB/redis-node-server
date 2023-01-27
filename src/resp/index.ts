// Specs: https://redis.io/docs/reference/protocol-spec/

const CR = '\r';
const LF = '\n';
const CRLF = `${CR}${LF}`;

export type Message = string | number | Error | String | Message[];

class MessageParser {
  private cursor: Cursor;

  constructor(text: string | RawMessage) {
    this.cursor = new Cursor(text.valueOf());
  }

  parse(): Message {
    const messageType = this.cursor.next(1);
    if (messageType == null) {
      throw new Error(`Message was already parsed`);
    }

    switch (messageType) {
      case '+': return this.parseSimpleString();
      case '-': return this.parseError();
      case ':': return this.parseInteger();
      case '$': return this.parseBulkString();
      case '*': return this.parseArray();
    }
    throw new Error(`Unknown message type "${messageType}" at ${this.cursor.ln}:${this.cursor.col}`);
  }

  private parseSimpleString() {
    let c = this.cursor.next(1);
    let message = '';
    while (c != null && c != CRLF) {
      message += c;
      c = this.cursor.next(1);
    }
    return message;
  }

  private parseError() {
    const message = this.parseSimpleString();
    return new Error(message);
  }

  private parseInteger() {
    const message = this.parseSimpleString();
    return Number(message);
  }

  private parseBulkString() {
    const length = this.parseInteger();
    if (length == -1) return null;
    const message = this.cursor.next(length);
    if (message == null) return '';
    // CRLF
    this.cursor.next(1);
    return new String(message);
  }

  private parseArray() {
    const length = this.parseInteger();
    const messages: Message[] = [];
    for (let i = 0; i < length; i++) {
      messages.push(this.parse());
    }
    return messages;
  }
}

class MessageStringifier {
  constructor() {
  }

  stringify(message: Message): string {
    if (message instanceof Array) {
      return this.stringifyArray(message);
    }
    if (message instanceof Error) {
      return this.stringifyError(message);
    }
    if (message instanceof String) {
      return this.stringifyBulkString(message);
    }
    if (typeof message == 'string') {
      return this.stringifySimpleString(message);
    }
    if (typeof message == 'number') {
      return this.stringifyInteger(message);
    }
    if (message === null) {
      return this.stringifyNull();
    }
    throw new Error(`Unknown message type: ${message}`);
  }

  private stringifyArray(message: Message[]) {
    return `*${message.length}${CRLF}` + message.map(m => this.stringify(m)).join('');
  }

  private stringifyError(message: Error) {
    return `-${message.message}${CRLF}`;
  }

  private stringifyBulkString(message: String) {
    return `$${message.length}${CRLF}${message}${CRLF}`;
  }

  private stringifySimpleString(message: string) {
    for (let i = 0; i < message.length - 1; i++) {
      if (message[i] == CR && message[i + 1] == LF) {
        throw new Error(`Message is not string safe: "${message}"`)
      } 
    }
    return `+${message}${CRLF}`;
  }

  private stringifyInteger(message: number) {
    if (message % 1 != 0) {
      throw new Error(`Message is not an integer: ${message}`);
    }
    return `:${message}${CRLF}`;
  }

  private stringifyNull() {
    return `$-1${CRLF}`;
  }
}

export class RawMessage {
  constructor(private text: string) {
    // Validate
    parseMessage(text);
  }

  valueOf() {
    return this.text;
  }

  toString() {
    return this.text;
  }
}

class Cursor {
  private start = 0;
  private end = this.start;

  #ln = 1;
  get ln() { return this.#ln; }

  #col = 1;
  get col() { return this.#col; }

  #done = false;
  get done() { return this.#done; }

  #value = '';
  get value() { return this.#value; }

  constructor(private text: string) {}

  next(n: number) {
    if (this.done) return null;

    this.#value = '';
    this.start = this.end;
    if (this.start === this.text.length) {
      this.#done = true;
      return null;
    }

    this.end = Math.min(this.end + n, this.text.length);
    for (let i = this.start; i < this.end; i++) {
      let c = this.text[i];
      // If CRLF
      if (c == CR && this.text[i + 1] == LF) {
        c = CRLF;
        i++;
        this.end++;
      }
      if (c == CRLF) {
        this.#ln++;
        this.#col = 1;
      }
      else {
        this.#col++;
      }
      this.#value += c;
    }
    return this.value;
  }
}

export function parseMessage(text: string | RawMessage) {
  return new MessageParser(text).parse();
}

export function stringifyMessage(message: Message) {
  return new MessageStringifier().stringify(message);
}
