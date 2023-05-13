import { JwtAuthGuard } from './../../share/auth/guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { CreateChatAiDto } from './dto/create-chat-ai.dto';
import { ChatAiService } from './chat-ai.service';
import { Body, Controller, Get, Param, Post, UseGuards, Request, Patch } from "@nestjs/common";

@Controller('chat-ai')
export class ChatAIController {
  constructor(private readonly chatAiService: ChatAiService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  sendMessNew(@Body() body: CreateChatAiDto, @Request() request) {
    return this.chatAiService.createChatAiNew(body, request.user._id);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async sendMessUpdate(@Param('id') id, @Body() body: CreateChatAiDto, @Request() request) {
    return this.chatAiService.updateChatAi(id, body, request.user._id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllChatOfUser(@Request() request) {
    return this.chatAiService.findAll(request.user._id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOneById(@Param('id') id) {
    return this.chatAiService.getChatAIByIdDetails(id);
  }
}

