import { CommentService } from './comment.service';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class CommentGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly commentService: CommentService) { }

  // @SubscribeMessage('createComment')
  // async createComment(client, payload: any) {
  //   const data = await this.commentService.createComment(payload, client.userId);
  //   this.server.emit('commentNew', data)
  // }
}
