export class UnknownCommandError extends Error {
  constructor(command: string) {
    super(`Unknown command '${command}'`);
  }
};

export class CommandNotImplementedError extends Error {
  constructor(command: string) {
    super(`Command '${command}' not implemented`);
  }
}
