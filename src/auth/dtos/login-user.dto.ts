import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDTO {
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
}
