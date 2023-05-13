import { createConnection } from 'typeorm';
import { MYSQL_CONFIG } from '../constant.config';
import { MONGODB_URL } from '../constant.config';
export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () =>
      createConnection({
        type: 'mongodb',
        url: MONGODB_URL.url,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ssl: true,
        entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: false,
      }),
  },
];
