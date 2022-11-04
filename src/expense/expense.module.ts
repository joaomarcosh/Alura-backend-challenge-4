import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './expense.entity';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { ExpenseRepository } from './expense.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Expense])],
  providers: [ExpenseService, ExpenseRepository],
  controllers: [ExpenseController],
})
export class ExpenseModule {}
