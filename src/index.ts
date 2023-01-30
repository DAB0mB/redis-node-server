import * as net from 'net';
import { assertGet } from './assert';
import { commands } from './commands';
import { Command } from './commands/utils';
import { UnknownCommandError } from './errors';
import { RawMessage, parseMessage, stringifyMessage } from './resp';
import { store } from './store';

const PORT = Number(process.env.PORT || '6378');
const HOST = process.env.HOST || 'localhost';

const server = net.createServer((socket) => {
  socket.on('data', async (data) => {
    try {
      const localMessage = assertGet(parseMessage(data.toString()), Array);
      const args = localMessage.map(m => assertGet(m, String));
      let subCommands = commands;
      let commandName: string;
      let command: Command;
      do {
        commandName = args.shift().toLowerCase();
        command = subCommands[commandName];
        if (!command) {
          throw new UnknownCommandError(commandName);
        }
        subCommands = command.subCommands;
      } while (subCommands && args.length);
      const remoteMessage = await command(args, socket);
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
    await store.restore();
  }
  catch (e) {
    console.error('Failed to resotre data', e);
    process.exit(1);
  }

  server.on('error', (e) => {
    console.error('Error starting server', e);
    process.exit(1);
  });

  server.listen(PORT, HOST, () => {
    console.log(`Redis server listening on http://${HOST}:${PORT}`);
  });
}();
