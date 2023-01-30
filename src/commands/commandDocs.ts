import { RawMessage, stringifyMessage } from 'src/resp';
import { CommandMeta, CommandsRecord } from './utils';

let docsResp: RawMessage;

type Doc = Omit<CommandMeta, 'name'> & {
  subcommands?: Record<string, Doc>,
};

export const meta = {
  name: 'command|docs',
  summary: 'Get array of specific Redis command documentation',
  group: 'server',
  complexity: 'O(N) where N is the number of commands to look up',
};

export function handler(this: CommandsRecord) {
  if (docsResp) return docsResp;
  const docs = commandsToDocs(this);
  docsResp = new RawMessage(stringifyMessage(docs));
  return docsResp;
}

function commandsToDocs(commands: CommandsRecord) {
  const entries = Object.values(commands).map((command) => {
    const { name, ..._doc } = command.meta;
    const doc = _doc as Doc;
    if (command.subcommands) {
      doc.subcommands = commandsToDocs(command.subcommands)
    }
    return [name, doc] as const;
  });
  const docs = Object.fromEntries(entries);

  return docs;
}
