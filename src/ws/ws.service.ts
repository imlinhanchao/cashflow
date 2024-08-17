import { Injectable } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { WebSocket } from "ws";
import { SocketDto } from "./ws.dto";

@Injectable()
export class WsService {
  clientChannels = new Map<string, SocketDto[]>();

  constructor(private readonly authServices: AuthService) {}

  channelConnect(socket: SocketDto) {
    const clients = this.clientChannels.get(socket.channel) || [];
    if (socket.token) socket.user = this.authServices.validate(socket.token);
    clients.push(socket);
    this.clientChannels.set(socket.channel, clients);
  }

  channelDisconnect(socket: WebSocket) {
    this.clientChannels.forEach((clients, channel) => {
      const index = clients.findIndex((client) => client.socket === socket);
      if (index >= 0) {
        clients.splice(index, 1);
        this.clientChannels.set(channel, clients);
      }
    });
  }

  searchChannel(socket: WebSocket) {
    let client: SocketDto = null;
    this.clientChannels.forEach((clients, channel) => {
      client = clients.find((client) => client.socket === socket);
      if (client == null) return client;
      return false;
    });
    return client;
  }

  channelSend(channel: string, data: any) {
    const clients = this.clientChannels.get(channel) || [];
    clients.forEach((client) => {
      client.socket.send(JSON.stringify(data));
    });
  }

  channelClose(channel: string) {
    const clients = this.clientChannels.get(channel) || [];
    clients.forEach((client) => {
      client.socket.close();
    });
    this.clientChannels.delete(channel);
  }

  channelCloseAll() {
    this.clientChannels.forEach((clients, channel) => {
      clients.forEach((client) => {
        client.socket.close();
      });
    });
    this.clientChannels.clear();
  }

  channelList() {
    return [...this.clientChannels.keys()];
  }

  socketList(channel: string) {
    return (
      this.clientChannels
        .get(channel)
        .map((client) => client.user)
        .filter((client) => !!client) || []
    );
  }

  socketClose(channel: string, username: string): void | PromiseLike<void> {
    const clients = this.clientChannels.get(channel) || [];
    const closeIndexs = [];
    clients.forEach((client, index) => {
      if (client.user && client.user.username !== username) return;
      else if (!client.user && username === "anonymous")
        closeIndexs.push(index);
    });
    closeIndexs.forEach((index) => {
      clients[index].socket.close();
      clients.splice(index, 1);
    });
  }

  searchSocket(channel: string, username: string) {
    const clients = this.clientChannels.get(channel) || [];
    return clients.find(
      (client) => client.user && client.user.username === username
    );
  }
}
