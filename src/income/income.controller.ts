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

  @Get()
  async findAll(@Query('description') description: string): Promise<ReturnIncomeDTO[]> {
    return await this.incomeService.findAll(description);
  }

  @Get(':id')
  async findOneById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReturnIncomeDTO> {
    return await this.incomeService.findOneById(id);
  }
  
  @Get(':year/:month')
  async findByMonth(@Param('year') year: string, @Param('month') month: string): Promise<ReturnIncomeDTO[]> {
    return await this.incomeService.findByMonth(year,month);
  }

  @Post()
  async create(@Body() income: CreateIncomeDTO): Promise<ReturnIncomeDTO[]> {
    return await this.incomeService.create(income);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() income: UpdateIncomeDTO,
  ): Promise<ReturnIncomeDTO> {
    return await this.incomeService.update(id, income);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return await this.incomeService.delete(id);
  }
}
