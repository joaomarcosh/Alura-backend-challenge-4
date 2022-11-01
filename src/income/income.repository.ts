import { DataSource, Repository } from 'typeorm';
import {Injectable} from '@nestjs/common';
import { Income } from './income.entity';

@Injectable()
export class IncomeRepository extends Repository<Income> {
  constructor(private dataSource: DataSource) {
    super(Income, dataSource.createEntityManager());
  }
  
  async isMonthlyUnique(description: string, month: string, year: string): Promise<boolean> {
    const result = await this.dataSource
      .createQueryBuilder(/*'income'*/)
      .select('income')
      .from(Income, 'income')
      .where('income.description = :description', { description })
      .andWhere('EXTRACT("month" from  date) = :month', { month })
      .andWhere('EXTRACT("year" from date) = :year', { year })
      .getOne()
    return result ? false : true;
  }
}
