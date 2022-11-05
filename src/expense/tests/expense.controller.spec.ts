import { Test, TestingModule } from '@nestjs/testing';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { ExpenseController } from '../expense.controller';
import { ExpenseService } from '../expense.service';
import {
  mockExpense,
  mockReturnedExpense,
  mockUpdatedExpense,
} from './expense-data.mock';

const moduleMocker = new ModuleMocker(global);

describe('ExpenseController: ', () => {
  let expenseController: ExpenseController;
  let expenseService: ExpenseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpenseController],
    })
      .useMocker((token) => {
        //define return values here
        if (token == ExpenseService) {
          return {
            findAll: jest.fn().mockResolvedValue(mockReturnedExpense),
            findOneById: jest.fn().mockResolvedValue(mockReturnedExpense),
            create: jest.fn().mockResolvedValue(mockReturnedExpense),
            update: jest.fn().mockResolvedValue(mockUpdatedExpense),
            delete: jest.fn().mockResolvedValue(`Expense with id 1 deleted`),
          };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    expenseController = module.get<ExpenseController>(ExpenseController);
    expenseService = module.get<ExpenseService>(ExpenseService);
  });

  it('should be defined', () => {
    expect(expenseController).toBeDefined();
    expect(expenseService).toBeDefined();
  });

  describe('findAll(): ', () => {
    it('should return all expense', async () => {
      const result = await expenseController.findAll();

      expect(expenseService.findAll).toHaveBeenCalled();
      expect(result).toBe(mockReturnedExpense);
    });
  });

  describe('findOneById(): ', () => {
    it('should return one expense', async () => {
      const result = await expenseController.findOneById(1);

      expect(expenseService.findOneById).toHaveBeenCalledWith(1);
      expect(result).toBe(mockReturnedExpense);
    });
  });

  describe('create(): ', () => {
    it('should return created expense', async () => {
      const result = await expenseController.create(mockExpense);

      expect(expenseService.create).toHaveBeenCalledWith(mockExpense);
      expect(result).toBe(mockReturnedExpense);
    });
  });

  describe('update(): ', () => {
    it('should return updated expense', async () => {
      const result = await expenseController.update(1, { amount: 30 });

      expect(expenseService.update).toHaveBeenCalledWith(1, { amount: 30 });
      expect(result).toBe(mockUpdatedExpense);
    });
  });

  describe('delete(): ', () => {
    it('should return deleted expense message', async () => {
      const result = await expenseController.delete(1);

      expect(expenseService.delete).toHaveBeenCalledWith(1);
      expect(result).toBe(`Expense with id 1 deleted`);
    });
  });
});
