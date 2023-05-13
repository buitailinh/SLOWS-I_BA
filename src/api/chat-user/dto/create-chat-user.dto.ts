import { AppObject } from 'src/share/common/app.object';
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";

export class CreateChatUserDto {

  @ApiProperty({ type: 'enum', required: true, description: 'Type room' })
  @IsNotEmpty({
    message: 'This type room  is not empty',
  })
  @IsEnum(AppObject.CHAT_MODULE.TYPEROOM)
  typeRoom: string = AppObject.CHAT_MODULE.TYPEROOM.FRIEND;

  @ApiProperty({ required: true, description: 'user of room' })
  @IsNotEmpty({
    message: 'user is not empty',
  })
  users: string[];
}
