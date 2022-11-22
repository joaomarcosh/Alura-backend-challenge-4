import {
  IsString,
  IsNotEmpty,
  Length,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupUserDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(4, 32)
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(8, 32)
  password: string;
  
  @ApiProperty()
  @IsOptional()
  passwordConfirmation: string;
}
