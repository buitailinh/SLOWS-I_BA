import { User } from './../../user/user.entity';
import { BaseEntity } from './../../../share/database/BaseEntity';
import { CHATAI_CONST } from './../chat-ai.constant';
import { Column, Entity } from "typeorm";


@Entity({ name: CHATAI_CONST.MODEL_NAME })
export class ChatAi extends BaseEntity {

  @Column({ length: 100 })
  content: string;

  @Column()
  user: string;

  @Column({ default: [], array: true })
  chat: any[];

}
