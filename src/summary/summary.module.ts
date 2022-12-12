import { Module } from '@nestjs/common';
import { SummaryService } from './summary.service';
import { SummaryController } from './summary.controller';
import { ExpenseModule } from '../expense/expense.module';
import { IncomeModule } from '../income/income.module';

@Module({
  imports: [ExpenseModule, IncomeModule],
  providers: [SummaryService],
  controllers: [SummaryController],
})
export class SummaryModule {}
