import * as fs from 'fs';
import * as net from 'net';
import * as resp from './resp';

const PORT = Number(process.env.PORT || '6378');
const HOST = process.env.HOST || 'localhost';

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const message = resp.parseMessage(data.toString());
    if (
      message instanceof Array &&
      typeof message[0] == 'string' && message[0] === 'command' &&
      typeof message[0] == 'string' && message[1] === 'docs'
    ) {
      fs.createReadStream(require.resolve('./resp/docs.resp')).pipe(socket);
      return;
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Redis clone listening on http://${HOST}:${PORT}`);
});
