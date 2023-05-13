import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";


export class CreateChatAiDto {


  @ApiProperty({ type: 'String', required: true, description: 'Content of my question' })
  @IsNotEmpty({
    message: 'This comment is not empty',
  })
  @MaxLength(8000)
  message: string;
}
