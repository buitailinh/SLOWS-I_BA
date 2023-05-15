import { ERROR } from 'src/share/common/error-code.const';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessagesRepository } from './messages.repository';
import { Messages } from './entities/message.entity';
import { UserService } from '../user/user.service';
import { In, Not } from 'typeorm';

@Injectable()
export class MessagesService {

  constructor(
    private messagesRepository: MessagesRepository,
    private userService: UserService,
  ) { }

  async create(createMessageDto: CreateMessageDto) {
    const messageNew = await this.messagesRepository.save(createMessageDto);

    return messageNew;
  }

  async findAll(chatId, query, userId) {
    const take = query.take || 10;
    const page = query.page || 1;
    const skip = (page - 1) * take;
    const keyword = query.keyword || ''

    const listMessage = await this.messagesRepository.findAndOptions({
      where: {
        chatUser: chatId,
        deleteBy: Not(In([userId]))
      },
      order: { createdAt: 'DESC' },
      andWhere: keyword ? { textMessage: { $regex: keyword, $options: 'i' } } : null,
    });

    return this.messagesRepository.paginateResponse(listMessage, page, skip);
  }

  async findOne(_id) {
    const message = await this.messagesRepository.findOne(_id);
    if (!message) {
      throw new NotFoundException(ERROR.MESSAGES_NOT_FOUND.MESSAGE);
    }
    return message;
  }

  async findbyIdDetail(id) {
    const messageFound = await this.findOne(id);
    const user = await this.userService.getByUserId(messageFound.userSend);

    messageFound.userSend = user;

    return messageFound;

  }

  async update(id, updateMessageDto: UpdateMessageDto) {
    const { status } = updateMessageDto;
    const messageFound = await this.findOne(id);

    messageFound.status = status;
    messageFound.save();
    return messageFound;
  }

  async updateReadMsg(id, userId) {
    // console.log('vvvv')
    const messageFound = await this.findOne(id);
    // console.log('abc2', messageFound.reading.length)
    messageFound.reading.push(userId.toString());

    // await this.messagesRepository.update(messageFound._id, messageFound);
    // const messageFound1 = await this.findOne(id);
    return messageFound;
  }

  async deleteMsg(id, userId) {
    const messageFound = await this.findOne(id);

    messageFound.deleteBy.push(userId);
    messageFound.save();

    return messageFound;
  }

  async remove(id) {
    const messageFound = await this.findOne(id);
    await this.messagesRepository.delete(messageFound._id);
    return {
      message: `This action removes a #${id} message`
    };
  }
}
