import { verifyAccessToken } from './../../share/common/helper/jwt/index';
import { IoAdapter } from '@nestjs/platform-socket.io';



export class CustomIoAdapter extends IoAdapter {

  createIOServer(port: number, options?: any) {
    const server = super.createIOServer(port, options);
    server.setMaxListeners(40);
    server.use(async (socket, next) => {
      try {
        const accessToken = socket.handshake.auth.accessToken;
        if (!accessToken) return next();
        const payload = verifyAccessToken(accessToken);
        // console.log(payload);
        const userId = payload.userId;
        socket.userId = userId;
        socket.emit('authentication', {
          success: true,
          message: `Socket authenticated user ${userId}`,
        });
      } catch (error) {
        socket.emit('authentication', {
          success: false,
          message: error.message,
        });
      } finally {
        next();
      }
    });

    const onlineUsers = new Map()

    server.on('connection', (socket) => {
      socket.join(socket.userId);
      // global.chatSocket = socket;
      // onlineUsers.set(socket.userId, socket.id);
      console.log(`Client connected`, onlineUsers);
    });

    server.on('disconnect', (socket) => {
      // const rooms = Object.keys(socket.rooms);
      // onlineUsers.delete(socket.userId);
      // rooms.forEach((roomId) => {
      // if (roomId !== socket.userId) {
      // socket.leave(roomId);
      // }
      // });
      console.log(`Client ${socket.userId} disconnected`);
    });
    return server;
  }


}
