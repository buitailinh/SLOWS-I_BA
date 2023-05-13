import { UserService } from 'src/api/user/user.service';
import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { verifyAccessToken } from "src/share/common/helper/jwt";


@WebSocketGateway({
  transports: ['websocket', 'polling'],
  cors: {
    origin: '*',
  },
})
export class UserGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly userService: UserService
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


  @SubscribeMessage('updateFollow')
  async updateFollow(client, payload: any) {
    try {
      console.log('fffff', payload);
      this.server.emit('sendUpdateFollow', payload)
    } catch (error) {

    }
  }

}
