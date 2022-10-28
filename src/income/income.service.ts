import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Income } from './income.entity';

@Injectable()
export class IncomeService {
  constructor(
    @InjectRepository(Income)
    private IncomeRepository: Repository<Income>,
  ) {}

  async findAll(): Promise<Income[]> {
    return await this.IncomeRepository.find();
  }

  async findOneById(id: number): Promise<Income> {
    return await this.IncomeRepository.findOneBy({ id });
  }

  async create(income: Income): Promise<Income[]> {
    const insertResult = await this.IncomeRepository.insert(income);
    const createdIncome = await this.IncomeRepository.find({
      where: [...insertResult.identifiers],
    });
    return createdIncome;
  }

  async update(id: number, income: Income): Promise<Income> {
    await this.IncomeRepository.update(id, income);
    return await this.IncomeRepository.findOneBy({ id });
  }

  async delete(id: number): Promise<string> {
    await this.IncomeRepository.delete(id);
    return `Income with id ${id} deleted`;
  }
}