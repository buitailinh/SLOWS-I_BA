import { async } from '@firebase/util';
import { ObjectID } from 'typeorm';
import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { CreateChatAiDto } from './dto/create-chat-ai.dto';
import { UpdateChatAiDto } from './dto/update-chat-ai.dto';
import { openai } from 'src/configs/openAi.config';
import { UserService } from '../user/user.service';
import { ChatAiRepository } from './chat-ai.repository';
import { ERROR } from 'src/share/common/error-code.const';

@Injectable()
export class ChatAiService {
  constructor(
    private userService: UserService,
    public chatAiRespository: ChatAiRepository,
  ) { }


  async sendForAI(message: string, createNew: boolean = false) {

    const response1 = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: "user", content: message },
      ],
      temperature: 0.5,
      max_tokens: 500,
      top_p: 0.5,
      frequency_penalty: 0.5,
      presence_penalty: 0.2,
    })
    const result1 = response1.data.choices[0].message.content.trim();

    if (createNew === true) {
      const response2 = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: 'Content summary with 5 words : ' + result1,
        temperature: 0,
        max_tokens: 64,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop: ["'\n"],
      });
      const result2 = response2.data.choices[0].text.trim();
      return {
        msgRecieve: result1,
        content: result2,
      }
    }
    return {
      msgRecieve: result1,
    }
  }



  async findAll(userId: ObjectID) {
    const chatAi = await this.chatAiRespository.findAndOptions({
      where: { user: userId },
      order: { createdAt: 'DESC' }
    });
    return chatAi[0];
  }

  async getChatAIById(_id) {
    const chatAi = await this.chatAiRespository.findOne(_id);
    if (!chatAi) {
      throw new NotFoundException(ERROR.CHATAI_NOT_FOUND.MESSAGE);
    }
    return chatAi;
  }


  async getChatAIByIdDetails(_id, numlength: number = 10) {
    const chatAiFound = await this.getChatAIById(_id);

    const chatLength = chatAiFound.chat.length;
    const startIndex = chatLength > numlength ? chatLength - numlength : 0;
    const lastTenElements = chatAiFound.chat.slice(startIndex).map(itemChat => {
      return {
        message: itemChat.message,
        // userSend: itemChat.userSend === 'BOT' ? 'BOT' : await this.userService.getByUserId(itemChat.userSend),
        userSend: itemChat.userSend
      }

    });
    chatAiFound.chat = lastTenElements;
    return chatAiFound;

  }

  async createChatAiNew(createChatAI: CreateChatAiDto, userId) {
    const { message } = createChatAI;
    const userFound = await this.userService.getByUserId(userId);
    const chatAi = this.sendForAI(message, true);
    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new HttpException('Request timed out', HttpStatus.BAD_REQUEST));
      }, 60 * 1000); // 1 phút
    });
    try {
      const result = await Promise.race<ChatResult | ErrorResult | any>([chatAi, timeoutPromise]);
      if (result.msgRecieve && result.content) {
        const chatAi = {
          content: result.content,
          user: userFound._id,
          chat: [{
            message: message,
            userSend: 'me'
          }, {
            message: result.msgRecieve,
            userSend: 'gpt'
          }]
        };
        const chatAiNew = await this.chatAiRespository.save(chatAi);
        return chatAiNew;
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateChatAi(chatAiId, createChatAI: CreateChatAiDto, userId) {
    const { message } = createChatAI;
    const userFound = await this.userService.getByUserId(userId);
    const chatAiFound = await this.getChatAIById(chatAiId);
    chatAiFound.chat.push({
      message: message,
      userSend: 'me'
    })
    const lastSix = chatAiFound.chat.slice(Math.max(chatAiFound.chat.length - 5, 0));
    const messages = lastSix.map((message) => message.message).join("\n");

    const chatAiUpdate = this.sendForAI(messages);
    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new HttpException('Request timed out', HttpStatus.BAD_REQUEST));
      }, 60 * 1000); // 1 phút
    });
    try {
      const result = await Promise.race<ChatResult | ErrorResult | any>([chatAiUpdate, timeoutPromise]);
      console.log(result);
      if (result.msgRecieve) {
        chatAiFound.chat = [
          ...chatAiFound.chat,
          {
            message: result.msgRecieve,
            userSend: 'gpt'
          }
        ]
        await this.chatAiRespository.update(chatAiFound._id, { chat: chatAiFound.chat });


        return {
          message: result.msgRecieve,
          userSend: 'gpt'
        };
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateContentChatAi(chatAiId, updateChatAi: UpdateChatAiDto) {
    const chatAiFound = await this.getChatAIById(chatAiId);

    const { content } = updateChatAi;

    await this.chatAiRespository.update(chatAiFound._id, { content: content });

    return {
      msg: 'Update successfully!',
      status: 201
    }

  }

  async remove(chatAiId) {
    const chatAiFound = await this.getChatAIById(chatAiId);
    await this.chatAiRespository.delete(chatAiFound._id);
    return {
      msg: 'Delete successfully!',
      status: 200
    }
  }
}

interface ChatResult {
  msgRecieve: string;
  content: string;
}

interface ErrorResult {
  statusCode: number;
  message: string;
}
