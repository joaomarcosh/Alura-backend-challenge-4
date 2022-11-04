import { IsOptional, IsString, IsNotEmpty, IsPositive, IsDateString } from 'class-validator';

export class UpdateExpenseDTO {

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;
  
  @IsOptional()
  @IsPositive()
  amount: number;
  
  @IsOptional()
  @IsDateString()
  date: string;
}
