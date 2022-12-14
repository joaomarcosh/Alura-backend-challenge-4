import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Expense } from './expense.entity';
import { ReturnExpenseDTO } from './dtos/return-expense.dto';

@Injectable()
export class ExpenseRepository extends Repository<Expense> {
  constructor(private dataSource: DataSource) {
    super(Expense, dataSource.createEntityManager());
  }

  async isMonthlyUnique(
    userId: number,
    description: string,
    month: string,
    year: string,
    expenseId = 0,
  ): Promise<boolean> {
    const result = await this.dataSource
      .createQueryBuilder()
      .select('expense')
      .from(Expense, 'expense')
      .where('expense.description = :description', { description })
      .andWhere('expense.id != :expenseId', { expenseId })
      .andWhere('expense.userId = :userId', { userId })
      .andWhere('EXTRACT("month" from  date) = :month', { month })
      .andWhere('EXTRACT("year" from date) = :year', { year })
      .getOne();
    return result ? false : true;
  }

  async findByMonth(
    userId: number,
    year: string,
    month: string,
  ): Promise<ReturnExpenseDTO[]> {
    return await this.dataSource
      .createQueryBuilder()
      .select('expense')
      .from(Expense, 'expense')
      .where('EXTRACT("year" from  date) = :year', { year })
      .andWhere('EXTRACT("month" from  date) = :month', { month })
      .andWhere('expense.userId = :userId', { userId })
      .getMany();
  }
}
