import * as net from 'net';
import commands from './commands';
import { Command } from './commands/utils';
import { UnknownCommandError } from './errors';
import * as RESP from './resp';

const PORT = Number(process.env.PORT || '6378');
const HOST = process.env.HOST || 'localhost';

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    let command: Command;
    let localMessage: RESP.Message;
    try {
      localMessage = RESP.parse(data.toString());
      if (!(localMessage instanceof Array)) {
        throw new UnknownCommandError();
      }
  
      const commandName = localMessage.shift()?.toString().toLowerCase();
      if (!commandName) {
        throw new UnknownCommandError();
      }
  
      command = commands.get(commandName);
      if (!command) {
        throw new UnknownCommandError(commandName);
      }
    }
    catch (e) {
      socket.write(RESP.stringify(e));
      return;
    }

    try {
      const remoteMessage = command(localMessage);
      if (remoteMessage instanceof RESP.RawMessage) {
        socket.write(remoteMessage.toString());
      }
      else {
        socket.write(RESP.stringify(remoteMessage));
      }
    }
    catch (e) {
      console.error(`Error in command "${command.name}"`, e);
      socket.write(RESP.stringify('Internal error'));
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Redis clone listening on http://${HOST}:${PORT}`);
});
