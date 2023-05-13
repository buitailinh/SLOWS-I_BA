import { MongoRepository } from 'typeorm';
import { MESSAGES_CONST } from './messages.constant';
import { Mongo2Repository } from './../../share/database/mongodb2.repository';
import { Inject, Injectable } from "@nestjs/common";
import { Messages } from './entities/message.entity';


@Injectable()
export class MessagesRepository extends Mongo2Repository<Messages>{
  constructor(
    @Inject(MESSAGES_CONST.MODEL_PROVIDER)
    messages: MongoRepository<Messages>,
  ) {
    super(messages);
  }
}
