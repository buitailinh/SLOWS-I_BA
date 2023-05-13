import { PartialType } from '@nestjs/mapped-types';
import { CreateChatAiDto } from './create-chat-ai.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateChatAiDto {


  id: string;

  @ApiProperty({ type: 'String', required: true, description: 'Content of my question' })
  @IsNotEmpty({
    message: 'This comment is not empty',
  })
  @IsString()
  @MaxLength(1000)
  content: string;
}
