import { JobQueueService } from './../../share/job-queue/job-queue.service';
import { UserChatUserDto } from './dto/user-chat-user.dto';
import { ERROR } from 'src/share/common/error-code.const';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { AppObject } from 'src/share/common/app.object';
import { ChatUserRepository } from './chat-user.repository';
import { Injectable } from '@nestjs/common';
import { CreateChatUserDto } from './dto/create-chat-user.dto';
import { UpdateChatUserDto } from './dto/update-chat-user.dto';
import { UserService } from '../user/user.service';
import { MessagesService } from '../messages/messages.service';
import { Any } from 'typeorm';
import { CreateMessageDto } from '../messages/dto/create-message.dto';

@Injectable()
export class ChatUserService {
  constructor(
    private userService: UserService,
    private messageService: MessagesService,
    private chatUserRepository: ChatUserRepository,
    private jobQueueService: JobQueueService

  ) { }
  async create(createChatUserDto: CreateChatUserDto, userId) {
    const { typeRoom, users } = createChatUserDto;
    if (users.length < 2)
      throw new HttpException('You need to add users to the list', HttpStatus.BAD_REQUEST);

    const listUser = await Promise.all(users.map(async (user) => {
      const userFound = await this.userService.getByUserId(user);
      return userFound._id
    }));


    const chatUserNew = {
      typeRoom: typeRoom ? typeRoom : AppObject.CHAT_MODULE.TYPEROOM.FRIEND,
      users: listUser,
      creator: typeRoom === AppObject.CHAT_MODULE.TYPEROOM.FRIEND ? listUser : [userId],
      messages: [],
      nameRoom: typeRoom === AppObject.CHAT_MODULE.TYPEROOM.FRIEND ? [null, null] : [null],
      avatarRoom: null,
      public: true,
    }

    return this.chatUserRepository.save(chatUserNew);
  }

  async findAll(userId, query) {

    const take = query.take || 10;
    const page = query.page || 1;
    const skip = (page - 1) * take;

    const userFound = await this.userService.getByUserId(userId);

    const listChatUsers = await this.chatUserRepository.findAndOptions({
      where: {
        users: { $in: [userFound._id] }
      },
      order: { updatedAt: 'DESC' },
    });
    listChatUsers[0] = await Promise.all(listChatUsers[0].map(async (item) => {

      const index = item.users.findIndex(userId => userId.toString() === userFound._id.toString());
      const msgFound = item.messages.length > 0 ? await this.messageService.findOne(item.messages[item.messages.length - 1]) : null;
      item.messages = [msgFound];
      if (index > -1) {

        if (item.typeRoom === AppObject.CHAT_MODULE.TYPEROOM.FRIEND) {
          item.users.splice(index, 1);
          item.nameRoom.splice(index, 1);
          if (item.nameRoom[0] === null) {
            item.users = await Promise.all(item.users.map(async (userId) => {
              const user = await this.userService.getByUserId(userId);
              item.nameRoom[0] = user.firstName + ' ' + user.lastName;
              item.avatarRoom = user.avatar ? user.avatar : null;
              return user;
            })
            )
          }
          else {
            item.users = await Promise.all(item.users.map(async (userId) => {
              const user = await this.userService.getByUserId(userId);
              item.avatarRoom = user.avatar ? user.avatar : null;
              return user;
            })
            )
          }

        } else {

          console.log('th4')
        }

      }
      return item;

    }

    ));

    // console.log('user', listChatUsers[0][0]);

    return this.chatUserRepository.paginateResponse(listChatUsers, page, skip);
  }

  async getChatUserById(_id) {
    const chatUser = await this.chatUserRepository.findOne(_id);

    if (!chatUser)
      throw new NotFoundException(ERROR.CHATUSER_NOT_FOUND.MESSAGE);

    return chatUser;
  }

  async getChatUserByIdDetails(id, userId, numlength: number = 50) {
    const chatUserFound = await this.getChatUserById(id);
    const userFound = await this.userService.getByUserId(userId);

    const index = chatUserFound.users.findIndex(userId => userId.toString() === userFound._id.toString());
    if (index > -1) {

      if (chatUserFound.typeRoom === AppObject.CHAT_MODULE.TYPEROOM.FRIEND) {
        chatUserFound.users.splice(index, 1);
        chatUserFound.nameRoom.splice(index, 1);
        if (chatUserFound.nameRoom[0] === null) {
          chatUserFound.users = await Promise.all(chatUserFound.users.map(async (userId) => {
            const user = await this.userService.getByUserId(userId);
            chatUserFound.nameRoom[0] = user.firstName + ' ' + user.lastName;
            chatUserFound.avatarRoom = user.avatar ? user.avatar : null;
            return user;
          })
          )
        }
        else {
          chatUserFound.users = await Promise.all(chatUserFound.users.map(async (userId) => {
            const user = await this.userService.getByUserId(userId);
            chatUserFound.avatarRoom = user.avatar ? user.avatar : null;
            return user;
          })
          )
        }

      } else {

        console.log('th4')
      }

    }
    const chatLength = chatUserFound.messages.length;
    const startIndex = chatLength > numlength ? chatLength - numlength : 0;
    const lastNumberElement = await Promise.all(chatUserFound.messages.slice(startIndex).map(itemChat => {
      return this.messageService.findOne(itemChat);
    }));
    chatUserFound.messages = lastNumberElement;
    return chatUserFound;
  }

  async findUser(userId, usersChat: UserChatUserDto) {
    const { users } = usersChat;
    const listUserFound = await Promise.all(users.map(async (user) => {
      const userFound = await this.userService.getByUserId(user);
      return userFound._id;
    }));
    const chatUsers = await this.chatUserRepository.findOne({
      where: {
        users: { $all: [userId, ...listUserFound] }
      }
    });

    if (!chatUsers) {
      const chatUserNew = {
        typeRoom: AppObject.CHAT_MODULE.TYPEROOM.FRIEND,
        users: [userId, ...users],
      }
      return this.create(chatUserNew, userId);
    }
    return chatUsers;
  }

  async sendMessage(id, createMessage: CreateMessageDto) {
    const { textChat, chatUser, photo, status } = createMessage;

    const chatUserFound = await this.getChatUserById(chatUser);
    const userFound = await this.userService.getByUserId(id);

    const messageNew = {
      chatUser: chatUserFound._id,
      textChat: textChat ? textChat : null,
      userSend: userFound._id,
      photo: photo ? photo : null,
      status: AppObject.CHAT_MODULE.MESSAGES.NONE,
      deleteBy: [],
      reading: [],
    }

    const message = await this.messageService.create(messageNew);
    chatUserFound.messages.push(message._id);
    chatUserFound.updatedAt = new Date;
    await this.chatUserRepository.update(chatUserFound._id, chatUserFound)
    await this.jobQueueService.sendMsgNotification({
      msgId: chatUserFound._id.toString(),
      usersId: chatUserFound.users,
      userIdSend: userFound._id.toString()
    })
    const chatLength = chatUserFound.messages.length;
    const startIndex = chatLength > 1 ? chatLength - 1 : 0;
    const lastNumberElement = await Promise.all(chatUserFound.messages.slice(startIndex).map(itemChat => {
      return this.messageService.findOne(itemChat);
    }));

    chatUserFound.messages = lastNumberElement;

    return chatUserFound;

  }

  async updateReadMsg(id, userId) {

    const chatUserFound = await this.getChatUserById(id);
    const userFound = await this.userService.getByUserId(userId);
    let foundOne = false;


    for (let i = chatUserFound.messages.length - 1; i >= 0; i--) {
      const item = await chatUserFound.messages[i];
      console.log('abc', item.reading.length)
      if (!item.reading.includes(userFound._id)) {
        if (!foundOne) {
          await this.messageService.updateReadMsg(item._id, userFound._id);
        }
      } else {
        foundOne = true;
      }
    }
    return;
  }

  async addUserForChat(id, userChat: UserChatUserDto, userId) {
    const { users } = userChat;
    const chatUserFound = await this.getChatUserById(id);
    await Promise.all(users.map(user => this.userService.getByUserId(user)));

    if (!chatUserFound.public) {
      await this.userService.getByUserId(userId);
      if (!chatUserFound.creator.includes(userId))
        throw new HttpException(`You cannot add a user`, HttpStatus.BAD_REQUEST);
    }

    chatUserFound.users.push(...users);
    chatUserFound.save();
    return chatUserFound;
  }

  async removeUserForChat(id, userChat: UserChatUserDto, userId) {
    const { users } = userChat;
    const chatUserFound = await this.getChatUserById(id);
    await Promise.all(users.map(user => this.userService.getByUserId(user)));

    if (!chatUserFound.public) {
      await this.userService.getByUserId(userId);
      if (!chatUserFound.creator.includes(userId))
        throw new HttpException(`You cannot remove a user`, HttpStatus.BAD_REQUEST);
    }

    chatUserFound.users = chatUserFound.users.filter((item) => !users.includes(item));

    chatUserFound.save();

    return chatUserFound;
  }

  async update(id, updateChatUserDto: UpdateChatUserDto, userId) {
    const { nameRoom, avatarRoom } = updateChatUserDto;
    const chatUserFound = await this.getChatUserById(id);

    if (!chatUserFound.public) {
      await this.userService.getByUserId(userId);
      if (!chatUserFound.creator.includes(userId))
        throw new HttpException(`You cannot remove a user`, HttpStatus.BAD_REQUEST);
    }

    const chatRoomUpdated = {
      nameRoom: nameRoom ? nameRoom : chatUserFound.nameRoom,
      avatarRoom: avatarRoom ? avatarRoom : chatUserFound.avatarRoom
    }

    await this.chatUserRepository.update(chatUserFound._id, chatRoomUpdated);

    return {
      message: `This action update a #${id} chat user`,
      status: 202
    };
  }

  async remove(id, userId) {
    const chatUserFound = await this.getChatUserById(id);

    if (chatUserFound.typeRoom === AppObject.CHAT_MODULE.TYPEROOM.GRUOP) {
      await this.userService.getByUserId(userId);
      if (!chatUserFound.creator.includes(userId))
        throw new HttpException(`You cannot remove a user`, HttpStatus.BAD_REQUEST);
    }

    await Promise.resolve(chatUserFound.messages.forEach(async (message) => {
      await this.messageService.remove(message);
    })
    )

    await this.chatUserRepository.delete(id);

    return `This action removes a #${id} chatUser`;
  }
}
