export class UnknownCommandError extends Error {
  constructor(command = '') {
    super(`Unknown command '${command}'`);
  }
}
