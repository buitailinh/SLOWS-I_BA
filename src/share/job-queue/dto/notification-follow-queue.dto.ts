import { User } from 'src/api/user/user.entity';
import { IsNotEmpty } from "class-validator";


export class NotificationFollowQueueDto {
  @IsNotEmpty()
  userSend: User;

  @IsNotEmpty()
  userReceive: User;

  @IsNotEmpty()
  status: string;

}
