import { PartialType } from '@nestjs/mapped-types';
import { CreateChatUserDto } from './create-chat-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateChatUserDto {

  @ApiProperty({ description: 'Name of room' })
  nameRoom: string;

  @ApiProperty({ description: 'avatar of room' })
  avatarRoom: string;
}
