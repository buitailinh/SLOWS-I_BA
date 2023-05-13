import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";
import { AppObject } from "../../../share/common/app.object";

export class RoleUserDto {

  @ApiProperty({
    required: true,
    enum: AppObject.USER_MODULE.ROLE,
    default: AppObject.USER_MODULE.ROLE.BASIC,
    description: 'role'
  })
  @IsEnum(AppObject.USER_MODULE.ROLE)
  @IsString()
  role: string;
}
