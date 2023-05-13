import { FriendRequest_Status } from './../interface/following.interface';
import { BaseEntity } from 'src/share/database/BaseEntity';
import { FOLLOWING_CONST } from './../following.constant';
import { Column, Entity } from "typeorm";


@Entity({ name: FOLLOWING_CONST.MODEL_NAME })
export class Following extends BaseEntity {
  @Column()
  creator: any;

  @Column()
  receiver: any;

  @Column()
  creatorStatus: FriendRequest_Status;

  @Column()
  receiverStatus: FriendRequest_Status;

  @Column({ default: false })
  creatorBlock: Boolean;

  @Column({ default: false })
  receiverBlock: Boolean;
}
