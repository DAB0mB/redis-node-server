import { Command, CommandMeta, CommandsRecord } from '~/commands/command';
import { RawMessage, stringifyMessage } from '~/resp';

let docsResp: RawMessage;

type Doc = Omit<CommandMeta, 'name'> & {
  subcommands?: Record<string, Doc>,
};

export const docs: Command = {
  meta: {
    name: 'command|docs',
    summary: 'Get array of Redis command documentations',
    group: 'server',
    complexity: 'O(N) where N is the total number of Redis commands',
  },

  handler(_args, { commands }) {
    if (docsResp) return docsResp;
    const docs = commandsToDocs(commands);
    docsResp = new RawMessage(stringifyMessage(docs));
    return docsResp;
  },
};

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
