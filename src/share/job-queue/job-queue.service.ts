import { async } from '@firebase/util';
import { parse } from 'querystring';
import { CreateJobBlockQueueDto } from './dto/create-job-block.dto';
import { NotificationFollowQueueDto } from './dto/notification-follow-queue.dto';
import { NotificationRemindQueueDto } from './dto/notification-remind-queue.dto';
import { NotificationJobQueueDto } from './dto/notification-job-queue.dto';
import { InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateJobQueueDto } from './dto/create-job-queue.dto';
import { NotificationMsgQueueDto } from './dto/notification-msg-queue.dto';


export class JobQueueService implements OnModuleInit {

  constructor(
    @InjectQueue('send-notification-queue') private queue: Queue,
  ) { }


  async likeNotification(notification: NotificationJobQueueDto) {

    await this.queue.add('send-notification-like', notification, { delay: 1000 });
  }

  async commentNotification(notification: NotificationJobQueueDto) {

    await this.queue.add('send-notification-comment', notification, { delay: 1000 });
  }

  async remindNotification(notification: NotificationRemindQueueDto) {

    await this.queue.add('send-notification-reminder', notification, { delay: 1000 });
  }

  async followNotification(notification: NotificationFollowQueueDto) {
    await this.queue.add('send-notification-follow', notification, { delay: 1000 });
  }

  async sendMsgNotification(notification: NotificationMsgQueueDto) {
    await this.queue.add('send-notification-msg', notification);
  }

  async addBlockUser(createJobBlock: CreateJobBlockQueueDto) {
    const { time, creatorId, receiverId } = createJobBlock;

    const job = await this.checkIfJobExists('add-block-user', creatorId, receiverId);
    if (job) {
      await job.remove();
      return {
        success: true,
        message: `User ${job.data.creatorId} was unblock ${job.data.receiverId} !`,
      }
    }
    await this.queue.add('add-block-user', createJobBlock, { delay: time });
    console.log(`User ${creatorId} was block ${receiverId} with time: ${time} !`);
    return {
      success: true,
      message: `User ${creatorId} was block ${receiverId} with time: ${time} !`,
    }
  }

  async checkIfJobExists(queueName: string, creatorId: string, receiverId: string): Promise<Job | null> {
    const jobs = await this.queue.getJobs(['delayed', 'paused', 'waiting']);
    const job = jobs.find((j) => j.queue.name === queueName && j.data.creatorId === creatorId && j.data.receiverId === receiverId);
    return job || null;
  }


  private async getQuestionCount(userId: string): Promise<number> {
    const job: Job<any> = await this.queue.getJob(userId);
    const { quantity } = JSON.parse(job?.data);
    console.log('data job', quantity);
    return quantity ? parseInt(quantity) : 0;
  }

  private async setQuestionCount(userId: string, quantity: number): Promise<void> {
    const data = {
      quantity
    }
    await this.queue.add(`chatAI_${userId}`, JSON.stringify(data));
  }

  async processQuestionMessage(userId: string) {
    // Kiểm tra xem khóa userId đã tồn tại trong Redis chưa
    const questionCount = await this.getQuestionCount(userId);

    if (questionCount === 5) {
      // Nếu questionCount = 5, không cho cộng thêm
      console.log('Không cho phép cộng thêm questionCount');
      return { status: 400, message: 'Ban da het luot hoi hom nay' };
    }

    // Tăng giá trị questionCount lên 1 và lưu vào Redis
    const newQuestionCount = questionCount + 1;
    await this.setQuestionCount(userId, newQuestionCount);

    console.log(`Đã cộng 1 vào questionCount của user ${userId}. Số lượng hiện tại: ${newQuestionCount}`);
  }

  async onModuleInit() {
    // Lập lịch công việc reset questionCount hàng ngày lúc 00:00:00
    await this.resetQuestionCountJob();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'checkFSOfItems',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async resetQuestionCountJob() {
    const userIds = await this.queue.getJobs(null);

    const regex = /^chatAI_.*/;
    await userIds.filter(async (userId) => {
      if (regex.test(userId.name))
        await this.setQuestionCount(userId.name, 0);
    })

    console.log('Đã reset questionCount cho tất cả các user');
  }
}
