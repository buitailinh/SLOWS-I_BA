import { verifyAccessToken } from './../../share/common/helper/jwt/index';
import { AuthService } from './../../share/auth/auth.service';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PostService } from './post.service';

@WebSocketGateway({
  transports: ['websocket', 'polling'],
  cors: {
    origin: '*',
  },
})
export class PostGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly postService: PostService,
  ) { }

  handleConnection(client: Socket) {
    const token = client.handshake.auth.accessToken;
    if (!token) {
      client.disconnect(true);
    } else {
      try {
        const payload = verifyAccessToken(token);
        if (!payload) {
          client.disconnect(true);
        }
      } catch (error) {
        client.disconnect(true);
      }

    }
  }

  // handleDisconnect(client: Socket) {
  //   console.log(`Client ${client.id} disconnected`);
  // }

  @SubscribeMessage('likePost')
  async actionLike(client, payload: any) {
    try {
      const data = await this.postService.updateLikes(payload.postId, client.userId);

      this.server.emit('updateLike', data);
    } catch (error) {
      console.log(error);
    }
  }

  @SubscribeMessage('createComment')
  async createComment(client, payload: any) {
    // console.log(`Create Commentpayload`, payload);
    const data = await this.postService.updateComments(payload, client.userId);

    this.server.emit('commentNew', data)
  }
}
