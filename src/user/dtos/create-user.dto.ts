import {
  IsString,
  IsNotEmpty,
  Length,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Roles } from '../enums/user-roles.enum';

export class CreateUserDTO {
  @ApiProperty({ example: 'test user' })
  @IsString()
  @IsNotEmpty()
  @Length(4, 32)
  username: string;

  @ApiProperty({
    example: 'user',
    default: 'user',
    description: 'user or admin',
  })
  @IsOptional()
  @IsEnum(Roles, { message: 'Role must be user or admin' })
  role: Roles;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsNotEmpty()
  @Length(8, 32)
  password: string;
}
