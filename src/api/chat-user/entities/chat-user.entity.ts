import { AppObject } from 'src/share/common/app.object';
import { BaseEntity } from 'src/share/database/BaseEntity';
import { CHATUSER_CONST } from './../chat-user.constant';
import { Column, Entity } from "typeorm";



@Entity({ name: CHATUSER_CONST.MODEL_NAME })
export class ChatUser extends BaseEntity {

  @Column({ type: 'enum', enum: AppObject.CHAT_MODULE.TYPEROOM, default: AppObject.CHAT_MODULE.TYPEROOM.FRIEND })
  typeRoom: string;

  @Column({ array: true })
  users: any[];

  @Column({ array: true })
  creator: any[];

  @Column({ array: true })
  messages: any[];

  @Column({})
  nameRoom: string[];

  @Column()
  avatarRoom: string;

  @Column({ default: true })
  public: boolean;



}
