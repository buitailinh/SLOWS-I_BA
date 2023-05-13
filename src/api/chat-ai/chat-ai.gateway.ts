import { verifyAccessToken } from './../../share/common/helper/jwt/index';
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { ChatAiService } from './chat-ai.service';
import { CreateChatAiDto } from './dto/create-chat-ai.dto';
import { UpdateChatAiDto } from './dto/update-chat-ai.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatAiGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatAiService: ChatAiService) { }

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

  @SubscribeMessage('createChatAi')
  async create(@MessageBody() createChatAiDto: CreateChatAiDto, client) {
    const data = await this.chatAiService.createChatAiNew(createChatAiDto, client.userId);
    this.server.emit('resultCreateChatAi', data);
  }

  @SubscribeMessage('findAllChatAi')
  async findAll(client) {
    const data = await this.chatAiService.findAll(client.userId);
    this.server.emit('resultFindAllChatAi', data);
  }

  @SubscribeMessage('findOneChatAi')
  async findOne(@MessageBody() payload: any) {
    const { id, numMsg } = payload;
    const data = await this.chatAiService.getChatAIByIdDetails(id, numMsg);

    this.server.emit('resultFindOneChatAi', data);
  }

  @SubscribeMessage('updateChatAi')
  async update(@MessageBody() payload: any, client) {
    const data = await this.chatAiService.updateChatAi(payload.id, payload, client.userId);

    this.server.emit('resultUpdateChatAi', data);
  }

  @SubscribeMessage('removeChatAi')
  remove(@MessageBody() id: number) {
    return this.chatAiService.remove(id);
  }
}
