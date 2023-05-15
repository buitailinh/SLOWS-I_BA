import { MessagesService } from './../messages/messages.service';
import { CreateMessageDto } from './../messages/dto/create-message.dto';
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { ChatUserService } from './chat-user.service';
import { CreateChatUserDto } from './dto/create-chat-user.dto';
import { UpdateChatUserDto } from './dto/update-chat-user.dto';
import { Server, Socket } from 'socket.io';
import { verifyAccessToken } from 'src/share/common/helper/jwt';

interface ChatUser {
  userId: string;
  roomId: string;
}

interface ChatRoom {
  roomId: string;
  users: ChatUser[];
}


@WebSocketGateway({
  transports: ['websocket', 'polling'],
  cors: {
    origin: '*',
  },
})
export class ChatUserGateway {

  private rooms: ChatRoom[] = [];
  private onlineUsers = new Map();


  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatUserService: ChatUserService,
    // private readonly messageService: MessagesService,
  ) { }


  @SubscribeMessage('joinRoom')
  handleJoinRoom(client, payload: { userId: string, roomId: string }) {

    const room = this.rooms.find(r => r.roomId === payload.roomId);

    if (!room) {
      // console.log('new rooom')
      const newRoom: ChatRoom = {
        roomId: payload.roomId,
        users: [{ userId: payload.userId, roomId: payload.roomId }],
      };
      this.rooms.push(newRoom);
      this.onlineUsers.set(payload.roomId, [client.userId]);
      client.join(payload.roomId);
    } else {
      // console.log('join')
      const user = room.users.find(u => u.userId === payload.userId);
      if (!user) {
        room.users.push({ userId: payload.userId, roomId: payload.roomId });
        let onlineUsersInRoom = this.onlineUsers.get(payload.roomId) || [];
        if (!onlineUsersInRoom.includes(client.userId)) {
          onlineUsersInRoom.push(client.userId);
          this.onlineUsers.set(payload.roomId, onlineUsersInRoom);
        }
        client.join(payload.roomId);
      }
    }
    client.emit("joinedRoom", payload);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, payload: { userId: string, roomId: string }) {
    const roomIndex = this.rooms.findIndex(r => r.roomId === payload.roomId);
    if (roomIndex !== -1) {
      const userIndex = this.rooms[roomIndex].users.findIndex(u => u.userId === payload.userId);
      if (userIndex !== -1) {
        this.onlineUsers.delete(payload.roomId);
        this.rooms[roomIndex].users.splice(userIndex, 1);
        if (this.rooms[roomIndex].users.length === 0) {
          this.rooms.splice(roomIndex, 1);
        } else {
          client.leave(payload.roomId);
        }
      }
    }
    client.emit("leftRoom", payload);
  }

  @SubscribeMessage('send-msg')
  async sendMsg(client: Socket, sendMessageDto: CreateMessageDto) {
    const sendUserSocket = this.onlineUsers.get(sendMessageDto.chatUser);
    try {
      const data = await this.chatUserService.sendMessage(sendMessageDto.userSend, sendMessageDto);
      if (sendUserSocket)
        sendUserSocket.forEach(element => {
          this.server.to(element).emit('recieve-msg', data);
        });
    } catch (error) {
      console.error(error);
      client.disconnect();
    }
  }
  @SubscribeMessage('read-msg')
  async readMsg(client, payload: { id, userId }) {
    await this.chatUserService.updateReadMsg(payload.id, payload.userId);
  }
  // @SubscribeMessage('findAllChatUser')
  // findAll() {
  //   return this.chatUserService.findAll();
  // })

  // @SubscribeMessage('findOneChatUser')
  // findOne(@MessageBody() id: number) {
  //   return this.chatUserService.findOne(id);
  // }

  // @SubscribeMessage('updateChatUser')
  // update(@MessageBody() updateChatUserDto: UpdateChatUserDto) {
  //   return this.chatUserService.update(updateChatUserDto.id, updateChatUserDto);
  // }

  // @SubscribeMessage('removeChatUser')
  // remove(@MessageBody() id: number) {
  //   return this.chatUserService.remove(id);
  // }
}
