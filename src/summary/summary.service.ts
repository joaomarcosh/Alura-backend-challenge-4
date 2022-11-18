import { Injectable } from '@nestjs/common';
import { ExpenseService } from '../expense/expense.service';
import { IncomeService } from '../income/income.service';
import { ExpenseCategories } from '../expense/enums/expense-categories.enum';

@Injectable()
export class SummaryService {
  constructor(
    private expenseService: ExpenseService,
    private incomeService: IncomeService,
  ) {}
  
  async getSummary(userId: number, year: string, month: string) {
    const monthlyExpenses = await this.expenseService.findByMonth(userId, year, month);
    const totalExpenseAmount = monthlyExpenses.reduce((total,expense) => total + expense.amount, 0);
    
    const monthlyIncomes = await this.incomeService.findByMonth(userId, year, month);
    const totalIncomeAmount = monthlyIncomes.reduce((total,income) => total + income.amount, 0);
    
    const finalBalance = totalIncomeAmount - totalExpenseAmount;
    
    const expenseAmountByCategory = {};
    
    Object.values(ExpenseCategories).forEach(category => {
      expenseAmountByCategory[category] = 0;
    });
    
    monthlyExpenses.forEach(expense => {
      expenseAmountByCategory[expense.category] =+ expense.amount;
    });
    
    return {totalExpenseAmount, totalIncomeAmount, finalBalance, expenseAmountByCategory};
  }
}
