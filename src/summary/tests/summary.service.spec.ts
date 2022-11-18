import { Test, TestingModule } from '@nestjs/testing';
import { SummaryService } from '../summary.service';
import { IncomeService } from '../../income/income.service';
import { ExpenseModule } from '../../expense/expense.module';
import { ExpenseService } from '../../expense/expense.service';
import { mockSummary } from './summary-data.mock';
import { mockIncome } from '../../income/tests/income-data.mock';
import { mockExpense } from '../../expense/tests/expense-data.mock';

const mockIncomeService = () => ({
  findByMonth: jest.fn(),
});

const mockExpenseService = () => ({
  findByMonth: jest.fn(),
});

describe('summaryService: ', () => {
  let summaryService;
  let expenseService;
  let incomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SummaryService,
        {
          provide: IncomeService,
          useFactory: mockIncomeService,
        },
        {
          provide: ExpenseService,
          useFactory: mockExpenseService,
        },
      ],
    }).compile();

    summaryService = await module.get<SummaryService>(SummaryService);
    expenseService = await module.get<ExpenseService>(ExpenseService);
    incomeService = await module.get<IncomeService>(IncomeService);
  });

  it('should be defined', () => {
    expect(summaryService).toBeDefined();
  });
  
  describe('getSummary(): ', () => {
    it('should return one expense', async () => {
      expenseService.findByMonth.mockResolvedValue([mockExpense]);
      incomeService.findByMonth.mockResolvedValue([mockIncome]);

      const result = await summaryService.getSummary(1,2022,10);

      expect(expenseService.findByMonth).toHaveBeenCalledWith(1,2022,10);
      expect(incomeService.findByMonth).toHaveBeenCalledWith(1,2022,10);
      expect(result).toMatchObject(mockSummary);
    });
  });
});
