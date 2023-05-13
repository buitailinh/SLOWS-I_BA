import { CHATAI_CONST } from './chat-ai.constant';
import { ChatAi } from './entities/chat-ai.entity';
import { Connection } from 'typeorm';

export const chatAiProvider = [
  {
    provide: CHATAI_CONST.MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.getRepository(ChatAi),
    inject: ['DATABASE_CONNECTION']
  }
]
