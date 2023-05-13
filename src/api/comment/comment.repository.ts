import { MongoRepository } from 'typeorm';
import { COMMENT_CONST } from './comment.constant';
import { Mongo2Repository } from './../../share/database/mongodb2.repository';
import { Inject, Injectable } from "@nestjs/common";
import { Comment } from './entities/comment.entity';


@Injectable()
export class CommentRepository extends Mongo2Repository<Comment>{
  constructor(
    @Inject(COMMENT_CONST.MODEL_PROVIDER)
    comment: MongoRepository<Comment>,
  ) {
    super(comment);
  }
}
