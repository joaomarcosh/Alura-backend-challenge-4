import { Test, TestingModule } from '@nestjs/testing';
import { IncomeService } from '../income.service';
import { IncomeRepository } from '../income.repository';
import {
  mockIncome,
  mockReturnedIncome,
  mockUpdatedIncome,
} from './income-data.mock';

const mockIncomeRepository = () => ({
  find: jest.fn(),
  findBy: jest.fn(),
  findOneBy: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  isMonthlyUnique: jest.fn(),
});

describe('incomeService: ', () => {
  let incomeRepository;
  let incomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncomeService,
        {
          provide: IncomeRepository,
          useFactory: mockIncomeRepository,
        },
      ],
    }).compile();

    incomeRepository = await module.get<IncomeRepository>(IncomeRepository);
    incomeService = await module.get<IncomeService>(IncomeService);
  });

  it('should be defined', () => {
    expect(incomeService).toBeDefined();
    expect(incomeRepository).toBeDefined();
  });

  describe('findAll(): ', () => {
    it('should return all income', async () => {
      incomeRepository.find.mockResolvedValue(mockReturnedIncome);

      const result = await incomeService.findAll();

      expect(incomeRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockReturnedIncome);
    });
    
    it('should return all income with matching description', async () => {
      incomeRepository.findBy.mockResolvedValue(mockReturnedIncome);

      const result = await incomeService.findAll('test%20income');

      expect(incomeRepository.findBy).toHaveBeenCalled();
      expect(result).toEqual(mockReturnedIncome);
    });
  });

  describe('findOneById(): ', () => {
    it('should return one income', async () => {
      incomeRepository.findOneBy.mockResolvedValue(mockReturnedIncome);

      const result = await incomeService.findOneById(1);

      expect(incomeRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockReturnedIncome);
    });
  });

  describe('create(): ', () => {
    it('should return created income', async () => {
      incomeRepository.isMonthlyUnique.mockResolvedValue(true);
      incomeRepository.insert.mockResolvedValue({ identifiers: [{ id: 1 }] });
      incomeRepository.find.mockResolvedValue(mockReturnedIncome);

      const result = await incomeService.create(mockIncome);

      expect(incomeRepository.insert).toHaveBeenCalledWith(mockIncome);
      expect(incomeRepository.find).toHaveBeenCalledWith({
        where: [{ id: 1 }],
      });
      expect(result).toEqual(mockReturnedIncome);
    });

    it('should throw an error if not monthly unique', async () => {
      incomeRepository.isMonthlyUnique.mockResolvedValue(false);

      await expect(incomeService.create(mockIncome)).rejects.toThrow();
    });
  });

  describe('update(): ', () => {
    it('should return updated income', async () => {
      incomeRepository.findOneBy
        .mockResolvedValueOnce(mockIncome)
        .mockResolvedValueOnce(mockUpdatedIncome);
      incomeRepository.isMonthlyUnique.mockResolvedValue(true);

      const result = await incomeService.update(1, { amount: 30 });

      expect(incomeRepository.update).toHaveBeenCalledWith(1, { amount: 30 });
      expect(incomeRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockUpdatedIncome);
    });

    it('should throw an error if not monthly unique', async () => {
      incomeRepository.isMonthlyUnique.mockResolvedValue(false);

      await expect(incomeService.create(mockIncome)).rejects.toThrow();
    });
  });

  describe('delete(): ', () => {
    it('should return deleted income message', async () => {
      incomeRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await incomeService.delete(1);

      expect(incomeRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(`Income with id 1 deleted`);
    });

    it('should return non existant income message', async () => {
      incomeRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await incomeService.delete(1);

      expect(incomeRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(`Income with id 1 does not exist`);
    });
  });
});
