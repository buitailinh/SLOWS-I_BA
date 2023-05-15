import { NotificationMsgQueueDto } from './dto/notification-msg-queue.dto';
import { CreateFollowingDto } from './../../api/user/dto/createFollowing.dto';
import { UserService } from 'src/api/user/user.service';
import { FollowingService } from './../../api/following/following.service';
import { NotificationRemindQueueDto } from './dto/notification-remind-queue.dto';
import { FirebaseDatabaseService } from 'src/share/common/external-services/firebase-admin/firebase-admin.service';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { NotificationJobQueueDto } from './dto/notification-job-queue.dto';
import { NotificationFollowQueueDto } from './dto/notification-follow-queue.dto';
import { CreateJobBlockQueueDto } from './dto/create-job-block.dto';

@Processor('send-notification-queue')
export class JobQueueConsuner {
  constructor(
    private readonly firebase: FirebaseDatabaseService,
    // private readonly followingService: FollowingService,
    private readonly userService: UserService
  ) { }

  @Process('send-notification-like')
  async sendLikeNotification(job: Job<NotificationJobQueueDto>) {
    await this.firebase.likePost(job.data.post, job.data.user);
    return {
      success: true,
      message: `User ${job.data.post._id} was had notification new`,
    };
  }

  @Process('send-notification-comment')
  async sendCommentNotification(job: Job<NotificationJobQueueDto>) {
    await this.firebase.commentPost(job.data.post, job.data.user);
    return {
      success: true,
      message: `User ${job.data.post._id} was had notification new`,
    };
  }

  @Process('send-notification-reminder')
  async sendNotificationReminder(job: Job<NotificationRemindQueueDto>) {
    await this.firebase.remindYouPost(job.data.post, job.data.user, job.data.userRemind);
    return {
      success: true,
      message: `User ${job.data.userRemind._id} was had notification new`,
    };
  }

  @Process('send-notification-follow')
  async sendNotificationFollow(job: Job<NotificationFollowQueueDto>) {
    await this.firebase.followUser(job.data.userSend, job.data.userReceive, job.data.status);
    return {
      success: true,
      message: `User ${job.data.userSend._id} was had notification new`,
    };
  }

  @Process('send-notification-msg')
  async sendMsgNotification(job: Job<NotificationMsgQueueDto>) {
    await this.firebase.notificationChat(job.data.msgId, job.data.usersId, job.data.userIdSend);
    return {
      success: true,
      message: `User ${job.data.msgId} was had notification new`,
    };
  }

  @Process('add-block-user')
  async addBlockUser(job: Job<CreateJobBlockQueueDto>) {

    const updateStatus: CreateFollowingDto = {
      creator: job.data.creatorId,
      receiver: job.data.receiverId,
      status: "Block",
      time: 0
    }
    await this.userService.creatOrUpdateFollow(updateStatus, job.data.creatorId);
    console.log('bo block');
    return {
      success: true,
      message: `User ${job.data.creatorId} was unblock ${job.data.receiverId} !`,
    };
  }
}

