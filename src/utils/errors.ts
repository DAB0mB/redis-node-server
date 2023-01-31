export class UnknownCommandError extends Error {
  constructor(command: string) {
    super(`Unknown command '${command}'`);
  }
}

export class CommandNotImplementedError extends Error {
  constructor(command: string) {
    super(`Command '${command}' not implemented`);
  }
}

export type ErrnoException = Error & {
  errno?: number;
  code?: string;
  path?: string;
  syscall?: string;
  stack?: string;
};
