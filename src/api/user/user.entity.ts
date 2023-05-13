import { Dalle } from './../dalle/entities/dalle.entity';
import { ParamCommonList } from './../../share/common/models/params.model';
import { PatternLib } from '../../share/utils/pattern.lib';
import { AppObject } from 'src/share/common/app.object';
import { Exclude, Type } from 'class-transformer';
import { BeforeInsert, BeforeUpdate, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { USER_CONST } from './user.constant';
import { BaseEntity } from 'src/share/database/BaseEntity';
import { Length } from 'class-validator';
import slugify from 'slugify';
@Entity({ name: USER_CONST.MODEL_NAME })
export class User extends BaseEntity {

  @Column({ length: 255, })
  firstName: string;

  @Column({ length: 255, })
  lastName: string;

  @Column({ length: 255 })
  email: string;

  @Exclude()
  @Column({ length: 255, select: false, })
  password?: string;

  @Column({ length: 255, default: null, })
  intro?: string;

  @Column({ default: null, })
  phone?: string;

  @Column({ length: 255, default: null, })
  brithday: Date;

  @Column({ length: 255, default: null, })
  avatar?: string;

  @Column({ type: 'enum', enum: AppObject.USER_MODULE.ROLE, default: AppObject.USER_MODULE.ROLE.BASIC })
  role: string;

  @Column({ default: false })
  isVerify: boolean;

  @Column({ default: null })
  refreshToken?: string;

  @Column({ length: 255 })
  // @Index({ unique: true })
  username: string;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    this.username = slugify(this.firstName + this.lastName);
  }
}

export interface ParamUserList extends ParamCommonList { }


