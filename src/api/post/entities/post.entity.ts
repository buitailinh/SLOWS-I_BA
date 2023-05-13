import { User } from './../../user/user.entity';
import { BaseEntity } from 'src/share/database/BaseEntity';
import { POST_CONST } from './../post.constant';
import { Column, Entity } from "typeorm";
import { Comment } from 'src/api/comment/entities/comment.entity';


@Entity({ name: POST_CONST.MODEL_NAME })
export class Post extends BaseEntity {
  @Column({ length: 3000 })
  content: string;

  @Column('text', { array: true })
  images: string[];

  @Column({ default: [], array: true })
  likes: any[];

  @Column({ default: [], array: true })
  comments: any[];

  @Column({})
  qrCode: string;

  @Column()
  author: any;

}
