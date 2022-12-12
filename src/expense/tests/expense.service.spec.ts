import { Test, TestingModule } from '@nestjs/testing';
import { ExpenseService } from '../expense.service';
import { ExpenseRepository } from '../expense.repository';
import { ILike } from 'typeorm';
import {
  mockExpense,
  mockReturnedExpense,
  mockUpdatedExpense,
} from './expense-data.mock';

const mockExpenseRepository = () => ({
  find: jest.fn(),
  findBy: jest.fn(),
  findOneBy: jest.fn(),
  findByMonth: jest.fn(),
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
      expenseRepository.findBy.mockResolvedValue(mockReturnedExpense);

      const result = await expenseService.findAll(1);

      expect(expenseRepository.findBy).toHaveBeenCalledWith({ userId: 1 });
      expect(result).toEqual(mockReturnedExpense);
    });

    it('should return all expense with matching description', async () => {
      expenseRepository.findBy.mockResolvedValue(mockReturnedExpense);

      const result = await expenseService.findAll(1, 'test%20expense');

      expect(expenseRepository.findBy).toHaveBeenCalledWith({
        userId: 1,
        description: ILike('test%20expense'),
      });
      expect(result).toEqual(mockReturnedExpense);
    });
  });

  describe('findOneById(): ', () => {
    it('should return one expense', async () => {
      expenseRepository.findOneBy.mockResolvedValue(mockReturnedExpense);

      const result = await expenseService.findOneById(1, 1);

      expect(expenseRepository.findOneBy).toHaveBeenCalledWith({
        id: 1,
        userId: 1,
      });
      expect(result).toEqual(mockReturnedExpense);
    });
  });

  describe('findByMonth(): ', () => {
    it('should return all expense from the specified month', async () => {
      expenseRepository.findByMonth.mockResolvedValue(mockReturnedExpense);

      const result = await expenseService.findByMonth(1, 2022, 10);

      expect(expenseRepository.findByMonth).toHaveBeenCalledWith(1, 2022, 10);
      expect(result).toEqual(mockReturnedExpense);
    });
  });

  describe('create(): ', () => {
    it('should return created expense', async () => {
      expenseRepository.isMonthlyUnique.mockResolvedValue(true);
      expenseRepository.insert.mockResolvedValue({ identifiers: [{ id: 1 }] });
      expenseRepository.find.mockResolvedValue(mockReturnedExpense);

      const result = await expenseService.create(1, mockExpense);

      expect(expenseRepository.insert).toHaveBeenCalledWith({
        ...mockExpense,
        userId: 1,
      });
      expect(expenseRepository.find).toHaveBeenCalledWith({
        where: [{ id: 1 }],
      });
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

      const result = await expenseService.update(1, 1, { amount: 30 });

      expect(expenseRepository.update).toHaveBeenCalledWith(1, { amount: 30 });
      expect(expenseRepository.findOneBy).toHaveBeenCalledWith({
        id: 1,
        userId: 1,
      });
      expect(result).toEqual(mockUpdatedExpense);
    });

    it('should throw an error if not monthly unique', async () => {
      expenseRepository.isMonthlyUnique.mockResolvedValue(false);

      await expect(expenseService.create(mockExpense)).rejects.toThrow();
    });
  });

  describe('delete(): ', () => {
    it('should return deleted expense message', async () => {
      expenseRepository.findOneBy.mockResolvedValue(mockExpense);
      expenseRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await expenseService.delete(1, 1);

      expect(expenseRepository.findOneBy).toHaveBeenCalledWith({
        id: 1,
        userId: 1,
      });
      expect(expenseRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(`Expense with id 1 deleted`);
    });

    it('should return non existant expense message', async () => {
      expenseRepository.findOneBy.mockResolvedValue(mockExpense);
      expenseRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await expenseService.delete(1, 1);

      expect(expenseRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(`Expense with id 1 does not exist`);
    });
  });
});
