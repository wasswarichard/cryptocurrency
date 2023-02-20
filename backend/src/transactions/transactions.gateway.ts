import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { OnEvent } from '@nestjs/event-emitter';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TransactionsGateway {
  @WebSocketServer()
  server: Server;

  constructor() {}
  @OnEvent('transaction.created')
  publishTransaction(transaction) {
    this.server.emit('transaction.created', transaction);
  }
}
