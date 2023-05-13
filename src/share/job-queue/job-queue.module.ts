import { UserModule } from 'src/api/user/user.module';
import { FirebaseAdminModule } from './../common/external-services/firebase-admin/firebase-admin.module';
import { Module, forwardRef } from '@nestjs/common';
import { JobQueueService } from './job-queue.service';
import { JobQueueController } from './job-queue.controller';
import { BullModule } from '@nestjs/bull';
import { JobQueueConsuner } from './job-queue.consumer';

@Module({
  imports: [FirebaseAdminModule, UserModule,
    //  forwardRef(() => UserModule),
    BullModule.forRoot({
      redis: {
        host: 'redis-12094.c14.us-east-1-3.ec2.cloud.redislabs.com',
        port: 12094,
        password: 'mc90UaE7lKZ3mgaq8qICS2hWeyXA4zs4',
      },
    }),
    BullModule.registerQueue({
      name: 'send-notification-queue',
    }),

  ],
  controllers: [JobQueueController],
  providers: [JobQueueService, JobQueueConsuner],
  exports: [JobQueueService]
})
export class JobQueueModule { }
