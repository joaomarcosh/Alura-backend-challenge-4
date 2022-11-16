import {
  IsString,
  IsNotEmpty,
  Length,
  IsOptional,
  IsEnum
} from 'class-validator';
import { Roles } from '../enums/user-roles.enum';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  @Length(4, 32)
  username: string;
  
  @IsOptional()
  @IsEnum(Roles, { message: 'Role must be user or admin'})
  role: Roles;

  @IsString()
  @IsNotEmpty()
  @Length(8, 32)
  password: string;
  
  @IsOptional()
  passwordConfirmation: string;
}
