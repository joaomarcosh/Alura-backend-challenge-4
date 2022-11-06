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

  async findAll(description: string): Promise<ReturnExpenseDTO[]> {
    if (description) {
      return await this.expenseRepository.findBy({
        description: ILike(description)
      })
    }
    return await this.expenseRepository.find();
  }

  async findOneById(id: number): Promise<ReturnExpenseDTO> {
    return await this.expenseRepository.findOneBy({ id });
  }
  
  async findByMonth(year: string, month: string): Promise<ReturnExpenseDTO[]> {
    return await this.expenseRepository.findByMonth(year, month);
  }

  async create(expense: CreateExpenseDTO): Promise<ReturnExpenseDTO[]> {
    const desc = expense.description;
    const date = expense.date.split('-');

    const unique = await this.expenseRepository.isMonthlyUnique(
      desc,
      date[1],
      date[0],
    );

    if (!unique)
      throw new ConflictException('This expense already exists for this month');

    const insertResult = await this.expenseRepository.insert(expense);
    const createdExpense = await this.expenseRepository.find({
      where: [...insertResult.identifiers],
    });
    return createdExpense;
  }

  async update(
    id: number,
    newInfo: UpdateExpenseDTO,
  ): Promise<ReturnExpenseDTO> {
    const oldInfo = await this.expenseRepository.findOneBy({ id });
    const oldDate = oldInfo.date.split('-');
    const newDate = newInfo.date ? newInfo.date.split('-') : null;

    const desc = newInfo.description || oldInfo.description;
    const month = newDate ? newDate[1] : oldDate[1];
    const year = newDate ? newDate[0] : oldDate[0];
    const oldId = oldInfo.id;

    const unique = await this.expenseRepository.isMonthlyUnique(
      desc,
      month,
      year,
      oldId,
    );

    if (!unique)
      throw new ConflictException('This expense already exists for this month');

    await this.expenseRepository.update(id, newInfo);
    return await this.expenseRepository.findOneBy({ id });
  }

  async delete(id: number): Promise<string> {
    const deleteResult = await this.expenseRepository.delete(id);
    if (deleteResult.affected == 0)
      return `Expense with id ${id} does not exist`;
    return `Expense with id ${id} deleted`;
  }
}
