import {
  IsOptional,
  IsString,
  IsNotEmpty,
  Length,
} from 'class-validator';

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(4, 32)
  username: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(8, 32)
  password: string;
}
