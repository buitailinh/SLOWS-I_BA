import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString, MaxLength } from "class-validator";


export class CreateCommentDto {
  @ApiProperty({ type: 'String', required: true, description: 'Content of my comment' })
  @IsNotEmpty({
    message: 'This comment is not empty',
  })
  @IsString()
  @MaxLength(1000)
  content: string;

  @ApiProperty({ type: 'String', required: true, description: 'Id post of comment' })
  @IsNotEmpty({
    message: 'This comment is not empty',
  })
  @IsString()
  postId: string;

}
