import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateDalleDto {
  @ApiProperty({ type: 'string', required: true, description: 'Description of phote is prompt' })
  @IsNotEmpty({
    message: 'Prompt is not empty',
  })
  @IsString()
  prompt: string;

  @ApiProperty({ type: 'array', required: true, description: 'photo' })
  @IsNotEmpty({
    message: 'Photo is not empty',
  })
  photos: string[];

  @ApiProperty({ type: 'boolean', default: false, description: 'Status share photo' })
  @IsBoolean()
  isShare: boolean;

}
