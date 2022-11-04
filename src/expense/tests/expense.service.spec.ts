import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Expense } from '../expense.entity';
import { ExpenseService } from '../expense.service';
import { ExpenseRepository } from '../expense.repository';
import { mockExpense, mockReturnedExpense, mockUpdatedExpense } from './expense-data.mock.ts';

const mockExpenseRepository = () => ({
  find: jest.fn(),
  findOneBy: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  isMonthlyUnique: jest.fn(),
});

describe('expenseService: ', () => {
  let expenseRepository;
  let expenseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpenseService,
        {
          provide: ExpenseRepository,
          useFactory: mockExpenseRepository,
        },
      ],
    }).compile();

    expenseRepository = await module.get<ExpenseRepository>(ExpenseRepository);
    expenseService = await module.get<ExpenseService>(ExpenseService);
  });

  it('should be defined', () => {
    expect(expenseService).toBeDefined();
    expect(expenseRepository).toBeDefined();
  });
  
  describe('findAll(): ', () => {
    it('should return all expense', async () => {
      expenseRepository.find.mockResolvedValue(mockReturnedExpense);
      
      const result = await expenseService.findAll();

      expect(expenseRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockReturnedExpense);
    });
  });
  
  describe('findOneById(): ', () => {
    it('should return one expense', async () => {
      expenseRepository.findOneBy.mockResolvedValue(mockReturnedExpense);
      
      const result = await expenseService.findOneById(1);

      expect(expenseRepository.findOneBy).toHaveBeenCalledWith({id:1});
      expect(result).toEqual(mockReturnedExpense);
    });
  });

  describe('create(): ', () => {
    it('should return created expense', async () => {
      expenseRepository.isMonthlyUnique.mockResolvedValue(true);
      expenseRepository.insert.mockResolvedValue({identifiers: [{id:1}]});
      expenseRepository.find.mockResolvedValue(mockReturnedExpense);
      
      const result = await expenseService.create(mockExpense);

      expect(expenseRepository.insert).toHaveBeenCalledWith(mockExpense);
      expect(expenseRepository.find).toHaveBeenCalledWith({where:[{id:1}]});
      expect(result).toEqual(mockReturnedExpense);
    });
    
    it('should throw an error if not monthly unique', async () => {
      expenseRepository.isMonthlyUnique.mockResolvedValue(false);
      
      await expect(expenseService.create(mockExpense)).rejects.toThrow();
    });
  });
  
  describe('update(): ', () => {
    it('should return updated expense', async () => {
      expenseRepository.findOneBy
        .mockResolvedValueOnce(mockExpense)
        .mockResolvedValueOnce(mockUpdatedExpense);
      expenseRepository.isMonthlyUnique.mockResolvedValue(true);
      
      const result = await expenseService.update(1, {amount:30});

      expect(expenseRepository.update).toHaveBeenCalledWith(1, {amount:30});
      expect(expenseRepository.findOneBy).toHaveBeenCalledWith({id:1});
      expect(result).toEqual(mockUpdatedExpense);
    });
    
    it('should throw an error if not monthly unique', async () => {
      expenseRepository.isMonthlyUnique.mockResolvedValue(false);
      
      await expect(expenseService.create(mockExpense)).rejects.toThrow();
    });
  });
  
  describe('delete(): ', () => {    
    it('should return deleted expense message', async () => {
      expenseRepository.delete.mockResolvedValue({affected: 1})
    
      const result = await expenseService.delete(1);

      expect(expenseRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(`Expense with id 1 deleted`);
    });
  });
});
