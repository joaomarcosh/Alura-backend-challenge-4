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
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserId } from '../utils/decorators/user-id.decorator';
import { ExpenseService } from './expense.service';
import { CreateExpenseDTO } from './dtos/create-expense.dto';
import { UpdateExpenseDTO } from './dtos/update-expense.dto';
import { ReturnExpenseDTO } from './dtos/return-expense.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('expense')
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  @ApiQuery({ name: 'description', required: false })
  @Get()
  async findAll(@UserId() userId: number, @Query('description') description: string): Promise<ReturnExpenseDTO[]> {
    return await this.expenseService.findAll(userId, description);
  }

  @Get(':id')
  async findOneById(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReturnExpenseDTO> {
    return await this.expenseService.findOneById(userId, id);
  }
  
  @Get(':year/:month')
  async findByMonth(@UserId() userId: number, @Param('year') year: string, @Param('month') month: string): Promise<ReturnExpenseDTO[]> {
    return await this.expenseService.findByMonth(userId,year,month);
  }

  @Post()
  async create(@UserId() userId: number, @Body() expense: CreateExpenseDTO): Promise<ReturnExpenseDTO[]> {
    return await this.expenseService.create(userId, expense);
  }

  @Put(':id')
  async update(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() expense: UpdateExpenseDTO,
  ): Promise<ReturnExpenseDTO> {
    return await this.expenseService.update(userId, id, expense);
  }

  @Delete(':id')
  async delete(@UserId() userId: number, @Param('id', ParseIntPipe) id: number): Promise<string> {
    return await this.expenseService.delete(userId, id);
  }
}
