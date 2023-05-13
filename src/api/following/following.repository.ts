import { MongoRepository } from 'typeorm';
import { FOLLOWING_CONST } from './following.constant';
import { Following } from './entities/following.entity';
import { Mongo2Repository } from 'src/share/database/mongodb2.repository';

import { Inject, Injectable } from "@nestjs/common";



@Injectable()
export class FollowingRepository extends Mongo2Repository<Following>{
  constructor(
    @Inject(FOLLOWING_CONST.MODEL_PROVIDER)
    following: MongoRepository<Following>
  ) {
    super(following);
  }
}
