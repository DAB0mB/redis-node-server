import { assertGet } from 'src/assert';
import { UnknownCommandError } from 'src/errors';
import { Message } from 'src/resp';
import docsResp from 'src/resp/docs';

export function command(message: Message[]) {
  const subCommand = assertGet(message[0], String).toString().toLowerCase();
  if (subCommand != 'docs') {
    return new UnknownCommandError(subCommand);
  }
  return docsResp;
};
