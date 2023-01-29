import { UnknownCommandError } from 'src/errors';
import docsResp from 'src/resp/docs';

export function command(args: String[]) {
  const subCommand = args[0].toLowerCase();
  if (subCommand != 'docs') {
    return new UnknownCommandError(subCommand);
  }
  return docsResp;
};
