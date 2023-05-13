import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateFollowingDto {

  @ApiProperty({ type: 'string', required: true, description: 'Receiver user' })
  @IsNotEmpty({
    message: 'Receiver is not empty',
  })
  receiver: string;

  @ApiProperty({ type: 'string', required: true, description: 'Creator user' })
  @IsNotEmpty({
    message: 'Ceceiver is not empty',
  })
  creator: string;

  @ApiProperty({ type: 'string', required: true, description: 'Creator user' })
  @IsString()
  status: string;

  time?: number;
}
