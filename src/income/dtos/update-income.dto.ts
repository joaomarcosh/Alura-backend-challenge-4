import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsPositive,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateIncomeDTO {
  @ApiProperty({ example: 'test income', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 100, required: false })
  @IsOptional()
  @IsPositive()
  amount: number;

  @ApiProperty({ example: '2022-11-23', description: 'format yyyy-mm-dd', required: false })
  @IsOptional()
  @IsDateString()
  date: string;
}
