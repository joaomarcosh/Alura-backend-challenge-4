import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Income } from './income.entity';
import { IncomeRepository } from './income.repository';
import { CreateIncomeDTO } from './dtos/create-income.dto';
import { UpdateIncomeDTO } from './dtos/update-income.dto';
import { ReturnIncomeDTO } from './dtos/return-income.dto';

@Injectable()
export class IncomeService {
  constructor(
    @InjectRepository(IncomeRepository)
    private incomeRepository: IncomeRepository,
  ) {}

  async findAll(): Promise<ReturnIncomeDTO[]> {
    return await this.incomeRepository.find();
  }

  async findOneById(id: number): Promise<ReturnIncomeDTO> {
    return await this.incomeRepository.findOneBy({ id });
  }

  async create(income: CreateIncomeDTO): Promise<ReturnIncomeDTO[]> {
    const desc = income.description;
    const date = income.date.split('-');
    
    const unique = await this.incomeRepository.isMonthlyUnique(desc,date[1],date[0]);
    
    if (!unique) throw new ConflictException('This income already exists for this month');
  
    const insertResult = await this.incomeRepository.insert(income);
    const createdIncome = await this.incomeRepository.find({
      where: [...insertResult.identifiers],
    });
    return createdIncome;
  }

  async update(id: number, newInfo: UpdateIncomeDTO): Promise<ReturnIncomeDTO> {
    const oldInfo = await this.incomeRepository.findOneBy({ id });
    const oldDate = oldInfo.date.split('-');
    const newDate = newInfo.date ? newInfo.date.split('-') : null;
    
    const desc = newInfo.description || oldInfo.description;
    const month = newDate ? newDate[1] : oldDate[1];
    const year = newDate ? newDate[0] : oldDate[0];
    const oldId = oldInfo.id;
    
    const unique = await this.incomeRepository.isMonthlyUnique(desc,month,year,oldId);
    
    if (!unique) throw new ConflictException('This income already exists for this month');
    
  
    await this.incomeRepository.update(id, newInfo);
    return await this.incomeRepository.findOneBy({ id });
  }

  async delete(id: number): Promise<string> {
    const deleteResult = await this.incomeRepository.delete(id);
    if (deleteResult.affected == 0) return `Income with id ${id} does not exist`;
    return `Income with id ${id} deleted`;
  }
}
