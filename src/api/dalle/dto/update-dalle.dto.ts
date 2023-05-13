import { PartialType } from '@nestjs/mapped-types';
import { CreateDalleDto } from './create-dalle.dto';

export class UpdateDalleDto extends PartialType(CreateDalleDto) {}
