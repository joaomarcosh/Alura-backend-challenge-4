import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Income } from './income.entity';
import { CreateIncomeDTO } from './dtos/create-income.dto';
import { UpdateIncomeDTO } from './dtos/update-income.dto';
import { ReturnIncomeDTO } from './dtos/return-income.dto';

@Injectable()
export class IncomeService {
  constructor(
    @InjectRepository(Income)
    private IncomeRepository: Repository<Income>,
  ) {}

  async findAll(): Promise<ReturnIncomeDTO[]> {
    return await this.IncomeRepository.find();
  }

  async findOneById(id: number): Promise<ReturnIncomeDTO> {
    return await this.IncomeRepository.findOneBy({ id });
  }

  async create(income: CreateIncomeDTO): Promise<ReturnIncomeDTO[]> {
    const desc = income.description;
    const date = income.date.split('-');

    const isNotMonthlyUnique = await this.IncomeRepository
      .createQueryBuilder('income')
      .where('income.description = :desc', { desc })
      .andWhere('EXTRACT("month" from  date) = :month', { month: date[1] })
      .andWhere('EXTRACT("year" from date) = :year', { year: date[0] })
      .getOne()
    
    if (isNotMonthlyUnique) throw new ConflictException('This income already exists for this month');
  
    const insertResult = await this.IncomeRepository.insert(income);
    const createdIncome = await this.IncomeRepository.find({
      where: [...insertResult.identifiers],
    });
    return createdIncome;
  }

  async update(id: number, newInfo: UpdateIncomeDTO): Promise<ReturnIncomeDTO> {
    const oldInfo = await this.IncomeRepository.findOneBy({ id });
    
    const oldDate = oldInfo.date.split('-');
    const newDate = newInfo.date ? newInfo.date.split('-') : null;
    
    const isNotMonthlyUnique = await this.IncomeRepository
      .createQueryBuilder('incomes')
      .where('incomes.description = :desc', { desc: newInfo.description || oldInfo.description })
      .andWhere('EXTRACT("month" from  date) = :month', { month: newDate ? newDate[1] : oldDate[1] })
      .andWhere('EXTRACT("year" from date) = :year', { year: newDate ? newDate[0] : oldDate[0] })
      .getOne()
      
    if (isNotMonthlyUnique) throw new ConflictException('This income already exists for this month');
  
    await this.IncomeRepository.update(id, newInfo);
    return await this.IncomeRepository.findOneBy({ id });
  }

  async delete(id: number): Promise<string> {
    await this.IncomeRepository.delete(id);
    return `Income with id ${id} deleted`;
  }
}
