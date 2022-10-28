import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { Income } from './income.entity';
import { IncomeService } from './income.service';

@Controller('income')
export class IncomeController {
  constructor(private incomeService: IncomeService) {}

  @Get()
  async findAll(): Promise<Income[]> {
    return await this.incomeService.findAll();
  }

  @Get(':id')
  async findOneById(@Param('id', ParseIntPipe) id: number): Promise<Income> {
    return await this.incomeService.findOneById(id);
  }

  @Post()
  async create(@Body() income: Income): Promise<Income[]> {
    return await this.incomeService.create(income);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() income: Income,
  ): Promise<Income> {
    return await this.incomeService.update(id, income);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return await this.incomeService.delete(id);
  }
}
