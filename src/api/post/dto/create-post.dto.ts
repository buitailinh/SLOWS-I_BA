import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreatePostDto {


  @ApiProperty({ type: 'string', required: true, description: 'My content of post ' })
  @IsNotEmpty()
  content: string;

}
