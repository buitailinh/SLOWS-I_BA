import { Connection } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { COMMENT_CONST } from './comment.constant';


export const commentProvider = [
  {
    provide: COMMENT_CONST.MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.getRepository(Comment),
    inject: ['DATABASE_CONNECTION'],
  }
]
