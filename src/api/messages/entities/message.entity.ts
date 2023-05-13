import { Column, Entity } from 'typeorm';
import { MESSAGES_CONST } from './../messages.constant';
import { BaseEntity } from 'src/share/database/BaseEntity';
import { AppObject } from 'src/share/common/app.object';


@Entity({ name: MESSAGES_CONST.MODEL_NAME })
export class Messages extends BaseEntity {

  @Column({ default: '' })
  textChat: string;

  @Column()
  reading: any[];

  @Column()
  userSend: any;

  @Column()
  chatUser: string;

  @Column({ default: '' })
  photo: string;

  @Column({ type: 'enum', enum: AppObject.CHAT_MODULE.MESSAGES, default: AppObject.CHAT_MODULE.MESSAGES.NONE })
  status: number;

  @Column({ default: [] })
  deleteBy: any[];

}
