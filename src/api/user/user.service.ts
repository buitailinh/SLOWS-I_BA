import { FollowingService } from './../following/following.service';

import { RoleUserDto } from './dto/role-user.dto';
import { CloudinaryService } from './../../share/cloudinary/cloudinary.service';
import { AppConst } from './../../share/common/app.const';
import { StringUtil } from './../../share/utils/string.util';
import { AppKey } from './../../share/common/app.key';

import { createConnection, Like, ObjectID } from 'typeorm';

import { HttpException, HttpStatus, Injectable, NotFoundException, StreamableFile, Query, CacheKey } from '@nestjs/common';
import { ERROR } from 'src/share/common/error-code.const';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { hashData } from 'src/share/common/helper/bcrypt';
import { slugify } from 'src/share/utils/slugify.lib';
import { generateSlug } from 'src/share/common/helper/slug';
import { ThisMonthInstance } from 'twilio/lib/rest/api/v2010/account/usage/record/thisMonth';
import { AppObject } from 'src/share/common/app.object';
import { FirebaseDatabaseService } from 'src/share/common/external-services/firebase-admin/firebase-admin.service';
import { CreateFollowingDto } from './dto/createFollowing.dto';



@Injectable()
export class UserService {
  constructor(
    // @InjectRepository(UserEntity)
    public userRepository: UserRepository,
    private cloudinary: CloudinaryService,
    private firebase: FirebaseDatabaseService,
    private followService: FollowingService
  ) { }



  async getAllUsers() {
    return this.userRepository.find();
  }

  /**
   *
   * Description: func get all users with filtering
   * @created by: BTLinh (28/02/2023)
   * @updated by:
   * @param query
   * @returns list of users
   */
  async getAll(query) {
    const take = query.take || 10;
    const page = query.page || 1;
    const skip = (page - 1) * take;
    const keyword = query.keyword || ''
    let order = null;
    if (query.order === 'ascend') {
      order = 1;
    } else if (query.order === 'descend') {
      order = -1;
    }

    const data = await this.userRepository.findAndOptions(
      {
        where: keyword ? { email: { $regex: keyword, $options: 'i' } } : null,
        order: order ? { email: order } : null,    //=== 'descend' ? 'DESC' : 'ASC'
        take: take,
        skip: skip
      }
    );
    return await this.userRepository.paginateResponse(data, page, take);
  }

  /**
   * Descriptions: func get user by id user
   * Create by: BTLinh (28/02/2023)
   * Edit by:
   * @param _id
   * @returns
   */
  async getByUserId(_id, userId?: any): Promise<User> {
    const user = await this.userRepository.findOne(_id)
    if (!user) {
      throw new NotFoundException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    return user;
  }


  async getByUser(_id, userId): Promise<any> {
    const userCheck = await this.userRepository.findOne(_id);
    if (!userCheck) {
      throw new NotFoundException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    let checkBlock = null;
    delete userCheck.password;
    if (userCheck._id !== userId) {
      const userFound = await this.userRepository.findOne(userId);
      checkBlock = await this.followService.CheckUserBlock(userFound, userCheck);
    }
    if (checkBlock.status) return {
      ...userCheck,
      ...checkBlock
    }
    return userCheck;
  }

  /**
   * Descriptions: func get user by username
   * Create by: BTLinh (28/02/2023)
   * @param username
   * @returns
   */
  async getByUserName(username: string) {
    const user = await this.userRepository.findOne({ username });
    return user;
  }

  /**
   * Descriptions: func check user by username
   * Create by: BTLinh (28/09/2023)
   * Edit by:
   * @param username
   * @returns
   */
  checkUsernameExists(username: string): boolean {
    const user = this.getByUserName(username);
    if (user) {
      return true;
    }
    return false;
  }

  /**
   * Descriptions: func get user by email address
   * Create By: BTLinh (28/02/2023)
   * Edit By:
   * @param email
   * @returns
   */
  async getByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneByCondition({ email });
    return user;
  }

  /**
   * Descriptions: func get user by number phone
   * Create By: BTLinh (28/02/2023)
   * Edit By:
   * @param phone
   * @returns
   */
  async getByPhone(phone: string): Promise<User> {
    const converphone = StringUtil.convertPhoneNumber(phone);
    const user = await this.userRepository.findOneByCondition({ phone: converphone });

    return user;
  }


  /**
   * Descriptions: func create user new
   * Create By: BTLinh (28/02/2023)
   * Edit By:
   * @param createUserDto
   * @returns
   */
  async create(createUserDto: CreateUserDto): Promise<User> {

    const { firstName, lastName, email, password, phone, brithday } = createUserDto;

    const userFound = await this.getByEmail(email)
    if (userFound) {
      throw new HttpException('Email already exists!', HttpStatus.BAD_REQUEST);
    }
    const converphone = StringUtil.convertPhoneNumber(phone)
    const phoneExit = await this.getByPhone(converphone);
    if (phoneExit)
      throw new HttpException('Phone already exists!', HttpStatus.BAD_REQUEST);
    const fullname = firstName + ' ' + lastName
    const slugname = this.generateUniqueUsername(fullname);
    // console.log(slugname);
    const hashedPassword = hashData(password);

    const userCreate: any = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone: converphone,
      username: slugname,
      brithday,
      intro: null,
      role: AppObject.USER_MODULE.ROLE.BASIC,
      dalles: [],
    }
    return await this.userRepository.save(userCreate);
  }


  /**
   * Descriptions: func update info user
   * Create By: BTLinh (28/02/2023)
   * Edit By:
   * @param id
   * @param updateUserDto
   * @returns
   */
  async update(id, updateUserDto: UpdateUserDto) {
    const user = await this.getByUserId(id);
    if (!user) throw new NotFoundException(ERROR.USER_NOT_FOUND.MESSAGE);
    const userdto: any = {
      ...updateUserDto
    }
    const userUpdate = Object.assign(user, userdto);
    console.log(user._id)
    await this.userRepository.update(user._id, userUpdate);
    return { manager: ` User updated successfully ${user._id} ` };
  }

  async addNumberPhone(_id: ObjectID, phone: string) {
    const user = await this.getByUserId(_id);
    if (!user) throw new HttpException('User not found!', HttpStatus.UNAUTHORIZED);
    const converphone = StringUtil.convertPhoneNumber(phone)
    const phoneFound = await this.getByPhone(converphone);
    if (phoneFound) throw new HttpException('Phone is exits!', HttpStatus.FOUND)
    await this.userRepository.update(user._id, { ...user, phone: converphone });

  }

  async resertPassword(email: string, newPassword: string) {
    const user = await this.getByEmail(email);
    if (!user) throw new NotFoundException({ message: AppKey.ERROR_MESSAGE.USER.ERR_NOT_EMAIL_EXIST });
    const hashPassword = hashData(newPassword);
    return await this.userRepository.update(user._id, { ...user, password: hashPassword });
  }


  /**
   * Descriptions: func update avatar user
   * Create By: BTLinh (28/02/2023)
   * Edit By:
   * @param user
   * @param file
   * @returns
   */
  async updateAvatar(user, file) {
    if (user.avatar) {
      await this.cloudinary.deleteImage(user.avatar)
    }
    const avatar = await this.cloudinary.uploadImage(file);
    await this.userRepository.update(user._id, { ...user, avatar });
    // console.log(test);
    return { avatar };
  }

  async updateNotification(userId) {
    await this.getByUserId(userId);
    await this.firebase.updateNotificationsToRead(userId);
    return;
  }


  /**
   * Descriptions: func delete user
   * Create By: BTLinh (28/02/2023)
   * Edit By:
   * @param id
   * @returns
   */
  async delete(id: number): Promise<any> {
    const user = await this.userRepository.findOneByCondition({
      where: { id }
    });
    if (!user) {
      throw new NotFoundException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    await this.userRepository.delete(user._id);
    return { 'message': `User deleted successfully ${user._id}` };
  }


  /**
   * Descriptions: func update verify email
   * Create By: BTLinh (28/02/2023)
   * Edit By:
   * @param email
   * @returns
   */
  async verifyEmail(email: string) {
    const user = await this.getByEmail(email);
    if (!user) throw new NotFoundException({ message: AppKey.ERROR_MESSAGE.USER.ERR_NOT_EMAIL_EXIST });
    return await this.userRepository.update(user._id, { isVerify: true });
  }


  generateUniqueUsername(fullname: string) {
    let suffix = '';
    console.log('username generated', fullname);
    const name = fullname.split(' ');
    const slugname = generateSlug(name.join(' '));
    // Check if the username already exists in the system
    do {
      suffix = Math.floor(Math.random() * 10000).toString().padStart(3, '0');
      // console.log(slugname + suffix);
    }
    while (!this.checkUsernameExists(slugname + suffix))
    // Generate a random 3-digit number as the suffix

    return slugname + suffix;
  }

  async deleteRefreshToken(userId) {
    const user = await this.getByUserId(userId);
    await this.userRepository.update(userId, { ...user, refreshToken: null });
    return true;
  }

  async updateRole(idUserUpdate: ObjectID, role: string) {
    const userFound = await this.getByUserId(idUserUpdate);
    if (!userFound) throw new HttpException('Not found User', HttpStatus.NOT_FOUND);

    await this.userRepository.update(userFound._id, { ...userFound, role });

    return 'OK';
  }

  async updateRoleManager(idUserUpdate: ObjectID, data: RoleUserDto, updateBy: ObjectID) {
    const { role } = data;
    if (idUserUpdate === updateBy) throw new HttpException('Logic unreasonable', HttpStatus.BAD_REQUEST);
    const updateMn = await this.getByUserId(updateBy);
    const userUpdate = await this.getByUserId(idUserUpdate);
    if (!updateMn || !userUpdate) throw new HttpException('User not found in System', HttpStatus.NOT_FOUND);

    if (updateMn.role !== AppObject.USER_MODULE.ROLE.ADMIN || updateMn.role !== AppObject.USER_MODULE.ROLE.MANAGER)
      throw new HttpException('User unauthorized', HttpStatus.UNAUTHORIZED);

    if (updateMn.role === AppObject.USER_MODULE.ROLE.ADMIN && role === AppObject.USER_MODULE.ROLE.MANAGER)
      throw new HttpException('User unauthorized', HttpStatus.UNAUTHORIZED);

    await this.updateRole(idUserUpdate, role);

    return { msg: 'Update Role successfully' };

  }

  async creatOrUpdateFollow(createFollowingDto: CreateFollowingDto, userId) {
    const { creator, receiver, status, time } = createFollowingDto;

    const creatorFound = await this.getByUserId(creator);
    const receiverFound = await this.getByUserId(receiver);
    return this.followService.update({ creator: creatorFound, receiver: receiverFound, status, time }, userId)

  }


  async findAllUserFollower(userId, query) {
    const userFound = await this.getByUserId(userId);

    const { data } = await this.followService.findAllUserFollower(userFound._id, query);

    const result = await Promise.all(data.map(async (follow) => {
      const creatorFound = await this.getByUserId(follow.creator);
      const receiverFound = await this.getByUserId(follow.receiver);

      follow.creator = creatorFound;
      delete follow.creator.refreshToken;
      follow.receiver = receiverFound;
      delete follow.receiver.refreshToken;

      return follow;
    }))

    // console.log(result)

    return result;
  }

  async findAllUserFollowing(userId, query) {
    const userFound = await this.getByUserId(userId);

    const { data } = await this.followService.findAllUserFollowing(userFound._id, query);

    const result = await Promise.all(data.map(async (follow) => {
      const creatorFound = await this.getByUserId(follow.creator);
      const receiverFound = await this.getByUserId(follow.receiver);

      follow.creator = creatorFound;
      delete follow.creator.refreshToken;
      follow.receiver = receiverFound;
      delete follow.receiver.refreshToken;

      return follow;
    }))

    // console.log(result)

    return result;
  }

  async findAllUserBlock(userId) {
    const userFound = await this.getByUserId(userId);

    return this.followService.findAllUserBlock(userFound._id);
  }

  async findAllFriends(userId, query) {
    const userFound = await this.getByUserId(userId);
    return this.followService.findAllUserFriend(userFound._id, query);
  }

  async findFollowOfUser(creator, receiver) {

    if (receiver === "false") return;
    const creatorFound = await this.getByUserId(creator);
    const receiverFound = await this.getByUserId(receiver);
    return this.followService.findOneDetail({ creator: creatorFound, receiver: receiverFound });
  }

  async findFollowUserAdd(userId, query) {
    const userFound = await this.getByUserId(userId);
    const listUserFound = await this.followService.findAllUser(userFound._id, query);

    // console.log('aaaa', listUserFound)

    const users = await this.userRepository.findAndOptions({
      where: {
        _id: { $nin: [...listUserFound[0], userFound._id] },

      }
    })


    return users;
  }


}
