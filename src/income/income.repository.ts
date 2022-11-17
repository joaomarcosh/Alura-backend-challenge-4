import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Income } from './income.entity';
import { ReturnIncomeDTO } from './dtos/return-income.dto';

@Injectable()
export class IncomeRepository extends Repository<Income> {
  constructor(private dataSource: DataSource) {
    super(Income, dataSource.createEntityManager());
  }

  async isMonthlyUnique(
    userId: number,
    description: string,
    month: string,
    year: string,
    incomeId = 0,
  ): Promise<boolean> {
    const result = await this.dataSource
      .createQueryBuilder()
      .select('income')
      .from(Income, 'income')
      .where('income.description = :description', { description })
      .andWhere('income.id != :incomeId', { incomeId })
      .andWhere('income.userId = :userId', { userId })
      .andWhere('EXTRACT("month" from  date) = :month', { month })
      .andWhere('EXTRACT("year" from date) = :year', { year })
      .getOne();
    return result ? false : true;
  }
  
  async findByMonth(userId: number, year: string, month: string): Promise<ReturnIncomeDTO[]> {
    return await this.dataSource
      .createQueryBuilder()
      .select('income')
      .from(Income, 'income')
      .where('EXTRACT("year" from  date) = :year', { year })
      .andWhere('EXTRACT("month" from  date) = :month', { month })
      .andWhere('income.userId = :userId', { userId })
      .getMany()
  }
}
