import { AppObject } from 'src/share/common/app.object';
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength } from "class-validator";


export class CreateMessageDto {

  @ApiProperty({ type: 'String', description: 'text' })
  @MaxLength(8000)
  textChat: string;

  @ApiProperty({ type: 'String', description: 'id of chat user' })
  @IsNotEmpty()
  chatUser: any;

  @ApiProperty({ type: 'String', description: 'id of chat user' })
  @IsNotEmpty()
  userSend: any;

  @ApiProperty({ type: 'String', description: 'photo you send' })
  photo: string;

  @ApiProperty({ type: 'Number', description: 'status of message' })
  status: number = AppObject.CHAT_MODULE.MESSAGES.NONE;
}
