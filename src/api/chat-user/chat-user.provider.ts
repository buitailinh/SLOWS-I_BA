import { Connection } from 'typeorm';
import { CHATUSER_CONST } from './chat-user.constant';
import { ChatUser } from './entities/chat-user.entity';


export const chatUserProvider = [
  {
    provide: CHATUSER_CONST.MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.getRepository(ChatUser),
    inject: ['DATABASE_CONNECTION']
  }
]
