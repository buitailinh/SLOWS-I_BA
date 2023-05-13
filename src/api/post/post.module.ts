import { FollowingModule } from './../following/following.module';
import { JobQueueModule } from './../../share/job-queue/job-queue.module';
import { PostGateway } from './post.gateway';
import { UserModule } from 'src/api/user/user.module';
import { postProvider } from './post.provider';
import { PostRepository } from './post.repository';
import { CloudinaryModule } from './../../share/cloudinary/cloudinary.module';
import { DatabaseModule } from './../../configs/database/database.module';
import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { CommentModule } from '../comment/comment.module';

@Module({
  imports: [DatabaseModule, UserModule, CloudinaryModule, CommentModule, JobQueueModule, FollowingModule],
  controllers: [PostController],
  providers: [PostService, PostRepository, ...postProvider, PostGateway],
  exports: [PostService, PostRepository]
})
export class PostModule { }
