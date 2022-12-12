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

export class UpdateExpenseDTO {
  @ApiProperty({ example: 'test expense', required: false })
  @IsOptional()
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

  @ApiProperty({ example: 25, required: false })
  @IsOptional()
  @IsPositive()
  amount: number;

  @ApiProperty({
    example: '2022-11-23',
    description: 'format yyyy-mm-dd',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  date: string;
}
