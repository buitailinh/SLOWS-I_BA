import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMessageDto } from './create-message.dto';

export class UpdateMessageDto {
  @ApiProperty({ type: 'Number', description: 'status of message' })
  status: number;
}
