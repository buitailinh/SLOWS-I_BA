import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty({ type: 'string', required: true, description: 'My photo of post' })
  @IsNotEmpty(
    {
      message: 'Please input a photo to post'
    })
  image: string;
}
