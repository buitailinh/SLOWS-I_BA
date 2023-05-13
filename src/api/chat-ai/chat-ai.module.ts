import { ChatAiRepository } from './chat-ai.repository';
import { UserModule } from './../user/user.module';
import { DatabaseModule } from './../../configs/database/database.module';
import { ChatAIController } from './chat-ai.controller';
import { Module } from '@nestjs/common';
import { ChatAiService } from './chat-ai.service';
import { ChatAiGateway } from './chat-ai.gateway';
import { chatAiProvider } from './chat-ai.provider';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [ChatAIController],
  providers: [ChatAiGateway, ChatAiService, ChatAiRepository, ...chatAiProvider],
  exports: [ChatAiService, ChatAiRepository]
})
export class ChatAiModule { }
