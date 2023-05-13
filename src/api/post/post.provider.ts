import { Post } from './entities/post.entity';
import { POST_CONST } from './post.constant';
import { Connection } from "typeorm";


export const postProvider = [
  {
    provide: POST_CONST.MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.getRepository(Post),
    inject: ['DATABASE_CONNECTION'],
  },
]
