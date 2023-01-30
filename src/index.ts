import * as net from 'net';
import { assertGet } from './assert';
import { commands } from './commands';
import { Command } from './commands/utils';
import { error, log } from './console';
import { UnknownCommandError } from './errors';
import { call } from './functions';
import { RawMessage, parseMessage, stringifyMessage } from './resp';
import { persistor } from './store';

const PORT = Number(process.env.PORT || '6378');
const HOST = process.env.HOST || 'localhost';

const server = net.createServer((socket) => {
  socket.on('data', async (data) => {
    try {
      const localMessage = assertGet(parseMessage(data.toString()), Array);
      const args = localMessage.map(m => assertGet(m, 'string'));
      let subcommands = commands;
      let commandName: string;
      let command: Command;
      do {
        commandName = args.shift().toLowerCase();
        command = subcommands[commandName];
        if (!command) {
          throw new UnknownCommandError(commandName);
        }
        subcommands = command.subcommands;
      } while (subcommands && args.length);
      const remoteMessage = await call(command.handler, commands, args, socket);
      if (remoteMessage instanceof RawMessage) {
        socket.write(remoteMessage.toString());
      }
      else {
        socket.write(stringifyMessage(remoteMessage));
      }
    }
    catch (e) {
      socket.write(stringifyMessage(e));
    }
  });
});

void async function () {
  try {
    await persistor.restore();
  }
  catch (e) {
    error('Failed to resotre data', e);
    process.exit(1);
  }

  server.on('error', (e) => {
    error('Error starting server', e);
    process.exit(1);
  });

  server.listen(PORT, HOST, () => {
    log(`Redis server listening on http://${HOST}:${PORT}`);
  });
}();
