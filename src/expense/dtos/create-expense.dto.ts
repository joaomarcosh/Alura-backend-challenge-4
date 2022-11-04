import { IsString, IsNotEmpty, IsPositive, IsDateString } from 'class-validator';

export class CreateExpenseDTO {

  @IsString()
  @IsNotEmpty()
  description: string;
  
  @IsPositive()
  amount: number;
  
  @IsDateString()
  date: string;
}
