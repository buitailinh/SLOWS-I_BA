import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JobQueueService } from './job-queue.service';
import { CreateJobQueueDto } from './dto/create-job-queue.dto';

@Controller()
export class JobQueueController {
  constructor(private readonly jobQueueService: JobQueueService) { }

}
