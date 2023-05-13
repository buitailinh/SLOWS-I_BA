import { Connection } from 'typeorm';
import { MESSAGES_CONST } from './messages.constant';
import { Messages } from './entities/message.entity';

export const messagesProvider = [
  {
    provide: MESSAGES_CONST.MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.getRepository(Messages),
    inject: ['DATABASE_CONNECTION']
  }
]
