import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsPositive,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ExpenseCategories } from '../enums/expense-categories.enum';

export class CreateExpenseDTO {
  @ApiProperty({ example: 'test expense' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    enum: ExpenseCategories,
    default: 'other',
    example: 'food',
    required: false,
  })
  @IsOptional()
  @IsEnum(ExpenseCategories, {
    message:
      'Category must be one of the following: food, health, housing, transportation, education, leisure, unexpected, other.',
  })
  category: string;

  @ApiProperty({ example: 25 })
  @IsPositive()
  amount: number;

  @ApiProperty({ example: '2022-11-23', description: 'format yyyy-mm-dd' })
  @IsDateString()
  date: string;
}
