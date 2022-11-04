import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDTO } from './dtos/create-expense.dto';
import { UpdateExpenseDTO } from './dtos/update-expense.dto';
import { ReturnExpenseDTO } from './dtos/return-expense.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('expense')
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  @Get()
  async findAll(): Promise<ReturnExpenseDTO[]> {
    return await this.expenseService.findAll();
  }

  @Get(':id')
  async findOneById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReturnExpenseDTO> {
    return await this.expenseService.findOneById(id);
  }

  @Post()
  async create(@Body() expense: CreateExpenseDTO): Promise<ReturnExpenseDTO[]> {
    return await this.expenseService.create(expense);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() expense: UpdateExpenseDTO,
  ): Promise<ReturnExpenseDTO> {
    return await this.expenseService.update(id, expense);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return await this.expenseService.delete(id);
  }
}
