import { JwtAuthGuard } from './share/auth/guards/jwt-auth.guard';
import { CommentModule } from './api/comment/comment.module';
import { DalleModule } from './api/dalle/dalle.module';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './share/auth/auth.module';
import { LoggerMiddleware } from './share/middlewares/logger.middleware';
import { DatabaseModule } from './configs/database/database.module';
import { CloudinaryModule } from './share/cloudinary/cloudinary.module';
import { PostModule } from './api/post/post.module';
import { ChatAiModule } from './api/chat-ai/chat-ai.module';
import { FirebaseAdminModule } from './share/common/external-services/firebase-admin/firebase-admin.module';
import { APP_GUARD } from '@nestjs/core';
import { JobQueueModule } from './share/job-queue/job-queue.module';
import { ChatUserModule } from './api/chat-user/chat-user.module';
import { MessagesModule } from './api/messages/messages.module';
import { FollowingModule } from './api/following/following.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UserModule, AuthModule, DatabaseModule,
    DalleModule,
    CloudinaryModule,
    PostModule,
    ChatAiModule,
    CommentModule,
    FirebaseAdminModule,
    JobQueueModule,
    ChatUserModule,
    MessagesModule,
    FollowingModule,

  ],
  providers: [
    // {
    // provide: APP_GUARD,
    // useClass: JwtAuthGuard,
    // },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
