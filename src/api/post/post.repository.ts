import { MongoRepository } from 'typeorm';
import { Mongo2Repository } from 'src/share/database/mongodb2.repository';
import { Inject, Injectable } from "@nestjs/common";
import { Post } from './entities/post.entity';
import { POST_CONST } from './post.constant';


@Injectable()
export class PostRepository extends Mongo2Repository<Post>{
  constructor(
    @Inject(POST_CONST.MODEL_PROVIDER)
    post: MongoRepository<Post>,
  ) {
    super(post);
  }
}
