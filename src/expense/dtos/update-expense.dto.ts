import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsPositive,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { ExpenseCategories } from '../enums/expense-categories.enum';

export class UpdateExpenseDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;
  
  @IsOptional()
  @IsEnum(ExpenseCategories, { message: 'Category must be one of the following: food, health, housing, transportation, education, leisure, unexpected, other.'})
  category: string;

  @IsOptional()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsDateString()
  date: string;
}
