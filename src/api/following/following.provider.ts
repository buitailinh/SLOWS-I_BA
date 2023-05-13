import { Following } from './entities/following.entity';
import { Connection } from 'typeorm';
import { FOLLOWING_CONST } from './following.constant';


export const followingProvider = [
  {
    provide: FOLLOWING_CONST.MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.getRepository(Following),
    inject: ['DATABASE_CONNECTION'],
  }
]
