import { Socket } from 'net';
import { Message, stringifyMessage } from 'src/resp';

type SocketListeners = { [key: string]: (...args: unknown[]) => unknown };

export class Messenger {
  private channels = new Map<string, Set<Socket>>();
  private socketListeners = new WeakMap<Socket, SocketListeners>;

  subscribe(socket: Socket, channel: string) {
    let sockets = this.channels.get(channel);
    if (!sockets) {
      sockets = new Set<Socket>();
      this.channels.set(channel, sockets);
    }

    if (sockets.has(socket)) return false;
    sockets.add(socket);

    const listeners: SocketListeners = {
      onClose: () => {
        this.unsubscribe(socket, channel);
      },
    };
    this.socketListeners.set(socket, listeners);
    socket.on('close', listeners.onClose);

    return true;
  }

  unsubscribe(socket: Socket, channel: string) {
    const sockets = this.channels.get(channel);
    if (!sockets) return false;
    if (!sockets.delete(socket)) return false;
    if (!sockets.size) this.channels.delete(channel);

    const listeners = this.socketListeners.get(socket);
    if (listeners) {
      this.socketListeners.delete(socket);
      socket.off('close', listeners.onClose);
    }

    return true;
  }

  publish(channel: string, message: Message) {
    const sockets = this.channels.get(channel);
    if (!sockets || !sockets.size) return 0;

    const data = stringifyMessage(['message', channel, message]);
    for (const socket of sockets) {
      socket.write(data);
    }

    return sockets.size;
  }
}
