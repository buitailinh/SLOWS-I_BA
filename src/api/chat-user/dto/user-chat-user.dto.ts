import { AppObject } from 'src/share/common/app.object';
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";

export class UserChatUserDto {

  @ApiProperty({ required: true, description: 'user of room' })
  @IsNotEmpty({
    message: 'user is not empty',
  })
  users: string[];
}
