import {
  IsString,
  IsNotEmpty,
  Length,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupUserDTO {
  @ApiProperty({ example: 'user' })
  @IsString()
  @IsNotEmpty()
  @Length(4, 32)
  username: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsNotEmpty()
  @Length(8, 32)
  password: string;
  
  @ApiProperty({ example: '12345678' })
  @IsOptional()
  passwordConfirmation: string;
}
