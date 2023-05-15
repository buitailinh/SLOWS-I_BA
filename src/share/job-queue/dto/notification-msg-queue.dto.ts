import { IsNotEmpty } from "class-validator";


export class NotificationMsgQueueDto {

  @IsNotEmpty()
  msgId: string;

  @IsNotEmpty()
  usersId: string[];

  @IsNotEmpty()
  userIdSend: string;

}
