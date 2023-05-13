import { ApiProperty } from '@nestjs/swagger';
import { AppObject } from './../../../share/common/app.object';
import { IsAlphanumeric, IsDate, IsEmail, IsEnum, IsNotEmpty, IsString, Length, Matches, ValidationError } from 'class-validator';
import { parse } from 'querystring';
import { PatternLib } from 'src/share/utils/pattern.lib';
import { Type } from 'class-transformer';

export class UpdateUserDto {

  @ApiProperty({ type: 'string', required: true, description: 'your firstname ', example: 'example', minLength: 2 })
  @IsNotEmpty({
    message: 'First Name is not empty',
  })
  @IsString()
  firstName: string;

  @ApiProperty({ type: 'string', required: true, description: 'your lastname ', example: 'example', minLength: 2 })
  @IsNotEmpty({
    message: 'Last Name is not empty',
  })
  @IsString()
  lastName: string;

  @ApiProperty({ required: false, description: 'Intro of User', type: 'string', example: 'Hello everyone!' })
  intro?: string;

  @ApiProperty({ required: false, description: 'your brithday', type: 'date', example: '2015-10-20' })
  @Type(() => Date)
  @IsDate()
  brithday?: Date = new Date();
}
