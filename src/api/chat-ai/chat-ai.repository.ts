import { CHATAI_CONST } from './chat-ai.constant';
import { ChatAi } from './entities/chat-ai.entity';
import { Mongo2Repository } from './../../share/database/mongodb2.repository';
import { Inject, Injectable } from "@nestjs/common";
import { MongoRepository } from 'typeorm';


@Injectable()
export class ChatAiRepository extends Mongo2Repository<ChatAi>{
  constructor(
    @Inject(CHATAI_CONST.MODEL_PROVIDER)
    chat_ai: MongoRepository<ChatAi>,
  ) {
    super(chat_ai);
  }
}
