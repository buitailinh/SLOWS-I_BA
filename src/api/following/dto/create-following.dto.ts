import { User } from 'src/api/user/user.entity';
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { FriendRequest_Status } from "../interface/following.interface";

export class CreateFollowingDto {

  @ApiProperty({ type: User, required: true, description: 'Receiver user' })
  @IsNotEmpty({
    message: 'Receiver is not empty',
  })
  receiver: User;

  @ApiProperty({ type: User, required: true, description: 'Creator user' })
  @IsNotEmpty({
    message: 'Ceceiver is not empty',
  })
  creator: User;

  @ApiProperty({ type: 'string', required: true, description: 'Creator user' })
  @IsString()
  status: string;

  time?: number;
}
