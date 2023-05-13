import { Dalle } from './entities/dalle.entity';
import { DALLE_CONST } from './dalle.constant';
import { Connection } from "typeorm";


export const dalleProvider = [
  {
    provide: DALLE_CONST.MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.getRepository(Dalle),
    inject: ['DATABASE_CONNECTION'],
  },
]
