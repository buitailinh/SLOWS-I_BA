import { MongoRepository } from 'typeorm';
import { Mongo2Repository } from './../../share/database/mongodb2.repository';
import { Inject, Injectable } from "@nestjs/common";
import { ChatUser } from './entities/chat-user.entity';
import { CHATUSER_CONST } from './chat-user.constant';


@Injectable()
export class ChatUserRepository extends Mongo2Repository<ChatUser>{
  constructor(
    @Inject(CHATUSER_CONST.MODEL_PROVIDER)
    chat_user: MongoRepository<ChatUser>,
  ) {
    super(chat_user);
  }
}
