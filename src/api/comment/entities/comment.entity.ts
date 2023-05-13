import { User } from './../../user/user.entity';
import { BaseEntity } from './../../../share/database/BaseEntity';
import { Column, Entity } from "typeorm";
import { COMMENT_CONST } from "../comment.constant";
import { Post } from 'src/api/post/entities/post.entity';

@Entity({ name: COMMENT_CONST.MODEL_NAME })
export class Comment extends BaseEntity {
  @Column({ length: 1000 })
  content: string;

  @Column()
  author: any;

  @Column()
  postId: string;

  @Column({ default: [] })
  likes: any[];

  @Column({ default: null })
  repComments: any[];
}
