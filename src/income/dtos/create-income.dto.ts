import {
  IsString,
  IsNotEmpty,
  IsPositive,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIncomeDTO {
  @ApiProperty({ example: 'test income' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 50 })
  @IsPositive()
  amount: number;

  @ApiProperty({ example: '2022-11-23', description: 'format yyyy-mm-dd' })
  @IsDateString()
  date: string;
}
