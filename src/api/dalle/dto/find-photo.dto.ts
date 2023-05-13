import { DETAIL_PHOTO_DALLE } from './../../../configs/openAi.config';
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CreateImageRequestSizeEnum } from 'openai';

export class FindDalleDto {
  @ApiProperty({ type: 'string', required: true, description: 'Description of phote is prompt' })
  @IsNotEmpty({
    message: 'Prompt is not empty',
  })
  @IsString()
  prompt: string;

  @ApiProperty({ type: 'int', description: 'Number photo', default: 1 })
  @IsNumber()
  numb: number;

}
