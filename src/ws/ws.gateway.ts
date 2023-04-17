import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { IncomingMessage } from 'http';
import { Server } from 'ws';
import { WebSocket } from 'ws';
import { WsService } from './ws.service';

@WebSocketGateway({path: '/ws'})
export class WsGateway {
  @WebSocketServer()
  server: Server;
  eventsService: WsService;

  constructor(eventsService: WsService) {
    this.eventsService = eventsService;
  }

  handleConnection(socket: WebSocket, request: IncomingMessage) {
    const params = new URLSearchParams(request.url.split('?')[1] || '');
    const channel = params.get('channel');
    const token = params.get('token');
    if (!channel) {
      socket.close();
      return;
    }
    this.eventsService.channelConnect({ channel, socket, token });
  }

  handleDisconnect(socket: WebSocket) {
    this.eventsService.channelDisconnect(socket);
  }

  @SubscribeMessage('boradcast')
  onBoradcastEvent(client: WebSocket, data: any) {
    const socket = this.eventsService.searchChannel(client);
    this.eventsService.channelSend(socket.channel, socket.user ? { from: socket.user, data } : data);
  }

  @SubscribeMessage('anonymous')
  onAnonymousEvent(client: WebSocket, data: any) {
    const socket = this.eventsService.searchChannel(client);
    this.eventsService.channelSend(socket.channel, data);
  }

}