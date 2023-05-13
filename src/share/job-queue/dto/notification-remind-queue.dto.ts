import { User } from './../../../api/user/user.entity';
import { IsNotEmpty } from "class-validator";
import { Post } from 'src/api/post/entities/post.entity';

export class NotificationRemindQueueDto {

  @IsNotEmpty()
  post: Post;

  @IsNotEmpty()
  user: User;

  @IsNotEmpty()
  userRemind: User;

}
