// Specs: https://redis.io/docs/reference/protocol-spec/

const CR = '\r';
const LF = '\n';
const CRLF = `${CR}${LF}`;

export type Message = string | number | Error | Message[];

class MessageParser {
  private cursor: Cursor;

  constructor(text: string) {
    this.cursor = new Cursor(text);
  }

  parse(): Message {
    const slice = this.cursor.next(1);
    if (slice == null) {
      throw new Error(`RESP: message was already parsed`);
    }

    switch (slice) {
      case '+': return this.parseSimpleString();
      case '-': return this.parseError();
      case ':': return this.parseInteger();
      case '$': return this.parseBulkString();
      case '*': return this.parseArray();
    }
    throw new Error(`RESP: unrecognized data type "${slice}" at ${this.cursor.ln}:${this.cursor.col}`);
  }

  private parseSimpleString() {
    let c = this.cursor.next(1);
    let message = '';
    while (c != null && c != CRLF && c != LF) {
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
    return message;
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
      if (c == CRLF || c == LF) {
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

export function parseMessage(message: string) {
  return new MessageParser(message).parse();
}
