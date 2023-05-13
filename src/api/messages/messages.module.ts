import { messagesProvider } from './messages.provider';
import { MessagesRepository } from './messages.repository';
import { UserModule } from 'src/api/user/user.module';
import { DatabaseModule } from './../../configs/database/database.module';
import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesRepository, ...messagesProvider],
  exports: [MessagesService, MessagesRepository]
})
export class MessagesModule { }
