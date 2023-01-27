import { UnknownCommandError } from 'src/errors';
import docsResp from 'src/resp/docs';

export function command(message: [String]) {
  const subCommand = message[0].toLowerCase();
  if (subCommand != 'docs') {
    return new UnknownCommandError(subCommand);
  }
  return docsResp;
};
