import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsPositive,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { ExpenseCategories } from '../enums/expense-categories.enum';

export class CreateExpenseDTO {
  @IsString()
  @IsNotEmpty()
  description: string;
  
  userId: number;
  
  @IsOptional()
  @IsEnum(ExpenseCategories, { message: 'Category must be one of the following: food, health, housing, transportation, education, leisure, unexpected, other.'})
  category: string;

  @IsPositive()
  amount: number;

  @IsDateString()
  date: string;
}
