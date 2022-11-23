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
import { ApiQuery } from '@nestjs/swagger';
import { UserId } from '../utils/decorators/user-id.decorator';
import { IncomeService } from './income.service';
import { CreateIncomeDTO } from './dtos/create-income.dto';
import { UpdateIncomeDTO } from './dtos/update-income.dto';
import { ReturnIncomeDTO } from './dtos/return-income.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('income')
export class IncomeController {
  constructor(private incomeService: IncomeService) {}

  @ApiQuery({ name: 'description', required: false })
  @Get()
  async findAll(@UserId() userId: number, @Query('description') description: string): Promise<ReturnIncomeDTO[]> {
    return await this.incomeService.findAll(userId, description);
  }

  @Get(':id')
  async findOneById(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReturnIncomeDTO> {
    return await this.incomeService.findOneById(userId, id);
  }
  
  @Get(':year/:month')
  async findByMonth(@UserId() userId: number, @Param('year') year: string, @Param('month') month: string): Promise<ReturnIncomeDTO[]> {
    return await this.incomeService.findByMonth(userId,year,month);
  }

  @Post()
  async create(@UserId() userId: number, @Body() income: CreateIncomeDTO): Promise<ReturnIncomeDTO[]> {
    return await this.incomeService.create(userId, income);
  }

  @Put(':id')
  async update(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() income: UpdateIncomeDTO,
  ): Promise<ReturnIncomeDTO> {
    return await this.incomeService.update(userId, id, income);
  }

  @Delete(':id')
  async delete(@UserId() userId: number, @Param('id', ParseIntPipe) id: number): Promise<string> {
    return await this.incomeService.delete(userId, id);
  }
}
