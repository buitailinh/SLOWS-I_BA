import { IsNotEmpty } from "class-validator";

export class CreateJobBlockQueueDto {
  @IsNotEmpty()
  creatorId: any;

  @IsNotEmpty()
  receiverId: any;

  time: number;
}
