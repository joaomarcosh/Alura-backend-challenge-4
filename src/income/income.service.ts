import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IncomeRepository } from './income.repository';
import { CreateIncomeDTO } from './dtos/create-income.dto';
import { UpdateIncomeDTO } from './dtos/update-income.dto';
import { ReturnIncomeDTO } from './dtos/return-income.dto';
import { ILike } from 'typeorm';

@Injectable()
export class IncomeService {
  constructor(
    @InjectRepository(IncomeRepository)
    private incomeRepository: IncomeRepository,
  ) {}

  async findAll(userId: number, description = ''): Promise<ReturnIncomeDTO[]> {
    if (description) {
      return await this.incomeRepository.findBy({
        userId: userId,
        description: ILike(description),
      });
    }
    return await this.incomeRepository.findBy({ userId });
  }

  async findOneById(userId: number, id: number): Promise<ReturnIncomeDTO> {
    return await this.incomeRepository.findOneBy({ userId, id });
  }

  async findByMonth(
    userId: number,
    year: string,
    month: string,
  ): Promise<ReturnIncomeDTO[]> {
    return await this.incomeRepository.findByMonth(userId, year, month);
  }

  async create(
    userId: number,
    income: CreateIncomeDTO,
  ): Promise<ReturnIncomeDTO[]> {
    const desc = income.description;
    const date = income.date.split('-');

    const unique = await this.incomeRepository.isMonthlyUnique(
      userId,
      desc,
      date[1],
      date[0],
    );

    if (!unique)
      throw new ConflictException('This income already exists for this month');

    const insertResult = await this.incomeRepository.insert({
      ...income,
      userId,
    });
    const createdIncome = await this.incomeRepository.find({
      where: [...insertResult.identifiers],
    });
    return createdIncome;
  }

  async update(
    userId: number,
    id: number,
    newInfo: UpdateIncomeDTO,
  ): Promise<ReturnIncomeDTO> {
    const oldInfo = await this.incomeRepository.findOneBy({ userId, id });
    const oldDate = oldInfo.date.split('-');
    const newDate = newInfo.date ? newInfo.date.split('-') : null;

    const desc = newInfo.description || oldInfo.description;
    const month = newDate ? newDate[1] : oldDate[1];
    const year = newDate ? newDate[0] : oldDate[0];

    const unique = await this.incomeRepository.isMonthlyUnique(
      oldInfo.userId,
      desc,
      month,
      year,
      oldInfo.id,
    );

    if (!unique)
      throw new ConflictException('This income already exists for this month');

    await this.incomeRepository.update(id, newInfo);
    return await this.incomeRepository.findOneBy({ id });
  }

  async delete(userId: number, id: number): Promise<string> {
    let deleteResult;
    const incomeToDelete = await this.incomeRepository.findOneBy({
      userId,
      id,
    });
    if (incomeToDelete) deleteResult = await this.incomeRepository.delete(id);
    if (!deleteResult || deleteResult.affected == 0)
      return `Income with id ${id} does not exist`;
    return `Income with id ${id} deleted`;
  }
}
