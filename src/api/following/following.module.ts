import { JobQueueModule } from './../../share/job-queue/job-queue.module';
import { FollowingRepository } from './following.repository';
import { UserModule } from 'src/api/user/user.module';
import { DatabaseModule } from 'src/configs/database/database.module';
import { Module, forwardRef } from '@nestjs/common';
import { FollowingService } from './following.service';
import { FollowingController } from './following.controller';
import { followingProvider } from './following.provider';

@Module({
  imports: [DatabaseModule, forwardRef(() => JobQueueModule)],
  controllers: [FollowingController],
  providers: [FollowingService, FollowingRepository, ...followingProvider],
  exports: [FollowingService, FollowingRepository]
})
export class FollowingModule { }
