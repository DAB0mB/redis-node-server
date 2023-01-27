import * as net from 'net';
import commands from './commands';
import { UnknownCommandError } from './errors';
import { assertGet } from './assert';
import { RawMessage, parseMessage, stringifyMessage } from './resp';

const PORT = Number(process.env.PORT || '6378');
const HOST = process.env.HOST || 'localhost';

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    try {
      const localMessage = assertGet(parseMessage(data.toString()), Array);
      const commandName = assertGet(localMessage.shift(), String).toString().toLowerCase();
      const command = commands.get(commandName);
      if (!command) {
        throw new UnknownCommandError(commandName);
      }
      const remoteMessage = command(localMessage);
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

server.listen(PORT, HOST, () => {
  console.log(`Redis clone listening on http://${HOST}:${PORT}`);
});
