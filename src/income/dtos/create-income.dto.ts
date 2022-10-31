import { IsString, IsNotEmpty, IsPositive, IsDateString } from 'class-validator';

export class CreateIncomeDTO {

  @IsString()
  @IsNotEmpty()
  description: string;
  
  @IsPositive()
  amount: number;
  
  @IsDateString()
  date: Date;
}
