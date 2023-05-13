import { JobQueueModule } from './../../share/job-queue/job-queue.module';
import { CommentGateway } from './comment.gateway';
import { commentProvider } from './comment.provider';
import { CommentService } from './comment.service';
import { CommentRepository } from './comment.repository';
import { CommentController } from './comment.controller';
import { UserModule } from './../user/user.module';
import { DatabaseModule } from './../../configs/database/database.module';
import { Module } from "@nestjs/common";
import { CloudinaryModule } from 'src/share/cloudinary/cloudinary.module';


@Module({
  imports: [DatabaseModule, UserModule, CloudinaryModule, JobQueueModule],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository, ...commentProvider, CommentGateway],
  exports: [CommentService, CommentRepository]
})
export class CommentModule { }
