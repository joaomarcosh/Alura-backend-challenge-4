import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExpenseRepository } from './expense.repository';
import { CreateExpenseDTO } from './dtos/create-expense.dto';
import { UpdateExpenseDTO } from './dtos/update-expense.dto';
import { ReturnExpenseDTO } from './dtos/return-expense.dto';
import { ILike } from 'typeorm';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(ExpenseRepository)
    private expenseRepository: ExpenseRepository,
  ) {}

  async findAll(userId: number, description = ''): Promise<ReturnExpenseDTO[]> {
    if (description) {
      return await this.expenseRepository.findBy({
        userId: userId,
        description: ILike(description),
      });
    }
    return await this.expenseRepository.findBy({ userId });
  }

  async findOneById(userId: number, id: number): Promise<ReturnExpenseDTO> {
    return await this.expenseRepository.findOneBy({ userId, id });
  }

  async findByMonth(
    userId: number,
    year: string,
    month: string,
  ): Promise<ReturnExpenseDTO[]> {
    return await this.expenseRepository.findByMonth(userId, year, month);
  }

  async create(
    userId: number,
    expense: CreateExpenseDTO,
  ): Promise<ReturnExpenseDTO[]> {
    const desc = expense.description;
    const date = expense.date.split('-');

    const unique = await this.expenseRepository.isMonthlyUnique(
      userId,
      desc,
      date[1],
      date[0],
    );

    if (!unique)
      throw new ConflictException('This expense already exists for this month');

    const insertResult = await this.expenseRepository.insert({
      ...expense,
      userId,
    });
    const createdExpense = await this.expenseRepository.find({
      where: [...insertResult.identifiers],
    });
    return createdExpense;
  }

  async update(
    userId: number,
    id: number,
    newInfo: UpdateExpenseDTO,
  ): Promise<ReturnExpenseDTO> {
    const oldInfo = await this.expenseRepository.findOneBy({ userId, id });
    const oldDate = oldInfo.date.split('-');
    const newDate = newInfo.date ? newInfo.date.split('-') : null;

    const desc = newInfo.description || oldInfo.description;
    const month = newDate ? newDate[1] : oldDate[1];
    const year = newDate ? newDate[0] : oldDate[0];

    const unique = await this.expenseRepository.isMonthlyUnique(
      oldInfo.userId,
      desc,
      month,
      year,
      oldInfo.id,
    );

    if (!unique)
      throw new ConflictException('This expense already exists for this month');

    await this.expenseRepository.update(id, newInfo);
    return await this.expenseRepository.findOneBy({ id });
  }

  async delete(userId: number, id: number): Promise<string> {
    let deleteResult;
    const expenseToDelete = await this.expenseRepository.findOneBy({
      userId,
      id,
    });
    if (expenseToDelete) deleteResult = await this.expenseRepository.delete(id);
    if (!deleteResult || deleteResult.affected == 0)
      return `Expense with id ${id} does not exist`;
    return `Expense with id ${id} deleted`;
  }
}
