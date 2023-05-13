import { Inject, Injectable } from '@nestjs/common';
import { Repository, MongoRepository, EntityRepository } from 'typeorm';

// import { TypeOrmRepository } from 'src/share/database/typeorm.repository';
import { USER_CONST } from './user.constant';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm'
import { Mongo2Repository } from 'src/share/database/mongodb2.repository';

@Injectable()
export class UserRepository extends Mongo2Repository<User>{
  constructor(
    @Inject(USER_CONST.MODEL_PROVIDER)
    user: MongoRepository<User>,
  ) {
    super(user);
  }
}
