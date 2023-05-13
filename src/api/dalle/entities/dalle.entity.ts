import { User } from 'src/api/user/user.entity';
import { Body } from '@nestjs/common';
import { DALLE_CONST } from './../dalle.constant';
import { BaseEntity } from "src/share/database/BaseEntity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity({ name: DALLE_CONST.MODEL_NAME })
export class Dalle extends BaseEntity {
  @Column({ length: 1000, })
  prompt: string;

  @Column({ type: 'array' })
  photos: string[];

  @Column()
  user: any;

  @Column({ default: false })
  isShare: boolean;
}
