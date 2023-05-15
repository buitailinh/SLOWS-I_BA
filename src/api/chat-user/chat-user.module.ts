import { JobQueueModule } from './../../share/job-queue/job-queue.module';
import { ChatUserController } from './chat-user.controller';
import { MessagesModule } from './../messages/messages.module';
import { CloudinaryModule } from './../../share/cloudinary/cloudinary.module';
import { UserModule } from 'src/api/user/user.module';
import { DatabaseModule } from './../../configs/database/database.module';
import { Module } from '@nestjs/common';
import { ChatUserService } from './chat-user.service';
import { ChatUserGateway } from './chat-user.gateway';
import { ChatUserRepository } from './chat-user.repository';
import { chatUserProvider } from './chat-user.provider';


@Module({
  imports: [DatabaseModule, CloudinaryModule, MessagesModule, UserModule, JobQueueModule],
  controllers: [ChatUserController],
  providers: [ChatUserGateway, ChatUserService, ChatUserRepository, ...chatUserProvider],
  exports: [ChatUserService, ChatUserRepository]
})
export class ChatUserModule { }
