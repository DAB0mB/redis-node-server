import * as fs from 'fs';
import * as net from 'net';
import * as RESP from './resp';

const PORT = Number(process.env.PORT || '6378');
const HOST = process.env.HOST || 'localhost';

const docsResp = fs.readFileSync(require.resolve('./resp/docs.resp')).toString();

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const message = RESP.parse(data.toString());
    if (
      message instanceof Array &&
      typeof message[0] == 'string' && message[0].toLowerCase() === 'command' &&
      typeof message[1] == 'string' && message[1].toLowerCase() === 'docs'
    ) {
      socket.write(docsResp);
      return;
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Redis clone listening on http://${HOST}:${PORT}`);
});
