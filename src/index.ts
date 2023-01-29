import * as net from 'net';
import { commands } from './commands';
import { UnknownCommandError } from './errors';
import { assertGet } from './assert';
import { RawMessage, parseMessage, stringifyMessage } from './resp';
import { store } from './store';

const PORT = Number(process.env.PORT || '6378');
const HOST = process.env.HOST || 'localhost';

const server = net.createServer((socket) => {
  socket.on('data', async (data) => {
    try {
      const localMessage = assertGet(parseMessage(data.toString()), Array);
      const args = localMessage.map(m => assertGet(m, String));
      const commandName = args.shift().toLowerCase();
      const command = commands.get(commandName);
      if (!command) {
        throw new UnknownCommandError(commandName);
      }
      const remoteMessage = await command(args);
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
