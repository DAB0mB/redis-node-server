import * as net from 'net';
import { onCommandRequest } from './commands';
import { initStore } from './store';
import { error, log } from './utils/console';

const PORT = Number(process.env.PORT || '6378');
const HOST = process.env.HOST || '0.0.0.0';

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    onCommandRequest(socket, data);
  });
});

export async function initServer() {
  await initStore();

  server.on('error', (e) => {
    error('Failed to start Redis server', e);
    process.exit(1);
  });

  server.listen(PORT, HOST, () => {
    log(`Redis server listening on http://${HOST}:${PORT}`);
  });
}
