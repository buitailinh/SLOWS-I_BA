import { ideahub } from 'googleapis/build/src/apis/ideahub';
import { JwtAuthGuard } from './../../share/auth/guards/jwt-auth.guard';
import { ChatUserService } from './chat-user.service';
import { Controller, Get, UseGuards, Request, Query, Param } from "@nestjs/common";


@Controller('chat')
export class ChatUserController {
  constructor(private chatService: ChatUserService) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  getListChatUsers(@Request() req, @Query() query) {
    return this.chatService.findAll(req.user._id, query);
  }

  @Get('/user/:id')
  @UseGuards(JwtAuthGuard)
  getFriend(@Param('id') id, @Request() req) {
    return this.chatService.findUser(req.user._id, { users: [id] });
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  getChatUser(@Param('id') id, @Request() req) {
    return this.chatService.getChatUserByIdDetails(id, req.user._id);
  }

}
