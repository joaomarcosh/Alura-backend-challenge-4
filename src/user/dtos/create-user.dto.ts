import {
  IsString,
  IsNotEmpty,
  Length,
  IsOptional,
} from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  @Length(4, 32)
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 32)
  password: string;
  
  @IsOptional()
  passwordConfirmation: string;
}
