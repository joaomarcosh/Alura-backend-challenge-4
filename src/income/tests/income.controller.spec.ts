import { Test, TestingModule } from '@nestjs/testing';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { IncomeController } from '../income.controller';
import { IncomeService } from '../income.service';
import {
  mockIncome,
  mockReturnedIncome,
  mockUpdatedIncome,
} from './income-data.mock';

const moduleMocker = new ModuleMocker(global);

describe('IncomeController: ', () => {
  let incomeController: IncomeController;
  let incomeService: IncomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncomeController],
    })
      .useMocker((token) => {
        //define return values here
        if (token == IncomeService) {
          return {
            findAll: jest.fn().mockResolvedValue(mockReturnedIncome),
            findOneById: jest.fn().mockResolvedValue(mockReturnedIncome),
            findByMonth: jest.fn().mockResolvedValue(mockReturnedIncome),
            create: jest.fn().mockResolvedValue(mockReturnedIncome),
            update: jest.fn().mockResolvedValue(mockUpdatedIncome),
            delete: jest.fn().mockResolvedValue(`Income with id 1 deleted`),
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

    incomeController = module.get<IncomeController>(IncomeController);
    incomeService = module.get<IncomeService>(IncomeService);
  });

  it('should be defined', () => {
    expect(incomeController).toBeDefined();
    expect(incomeService).toBeDefined();
  });

  describe('findAll(): ', () => {
    it('should return all income', async () => {
      const result = await incomeController.findAll(1, 'test');

      expect(incomeService.findAll).toHaveBeenCalledWith(1, 'test');
      expect(result).toBe(mockReturnedIncome);
    });
  });

  describe('findOneById(): ', () => {
    it('should return one income', async () => {
      const result = await incomeController.findOneById(1, 1);

      expect(incomeService.findOneById).toHaveBeenCalledWith(1, 1);
      expect(result).toBe(mockReturnedIncome);
    });
  });

  describe('findByMonth(): ', () => {
    it('should return all income from the specified month', async () => {
      const result = await incomeController.findByMonth(1, 2022, 10);

      expect(incomeService.findByMonth).toHaveBeenCalledWith(1, 2022, 10);
      expect(result).toBe(mockReturnedIncome);
    });
  });

  describe('create(): ', () => {
    it('should return created income', async () => {
      const result = await incomeController.create(1, mockIncome);

      expect(incomeService.create).toHaveBeenCalledWith(1, mockIncome);
      expect(result).toBe(mockReturnedIncome);
    });
  });

  describe('update(): ', () => {
    it('should return updated income', async () => {
      const result = await incomeController.update(1, 1, { amount: 30 });

      expect(incomeService.update).toHaveBeenCalledWith(1, 1, { amount: 30 });
      expect(result).toBe(mockUpdatedIncome);
    });
  });

  describe('delete(): ', () => {
    it('should return updated income', async () => {
      const result = await incomeController.delete(1, 1);

      expect(incomeService.delete).toHaveBeenCalledWith(1, 1);
      expect(result).toBe(`Income with id 1 deleted`);
    });
  });
});
