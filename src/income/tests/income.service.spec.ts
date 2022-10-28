import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Income } from '../income.entity';
import { IncomeService } from '../income.service';
import { mockIncome, mockReturnedIncome, mockUpdatedIncome } from './income-data.mock.ts';

const mockIncomeRepository = () => ({
  find: jest.fn(),
  findOneBy: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('incomeService: ', () => {
  let incomeRepository;
  let incomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncomeService,
        {
          provide: getRepositoryToken(Income),
          useFactory: mockIncomeRepository,
        },
      ],
    }).compile();

    incomeRepository = module.get(getRepositoryToken(Income));
    incomeService = module.get<IncomeService>(IncomeService);
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
  });
  
  describe('findOneById(): ', () => {
    it('should return one income', async () => {
      incomeRepository.findOneBy.mockResolvedValue(mockReturnedIncome);
      const result = await incomeService.findOneById(1);

      expect(incomeRepository.findOneBy).toHaveBeenCalledWith({id:1});
      expect(result).toEqual(mockReturnedIncome);
    });
  });

  describe('create(): ', () => {
    it('should return created income', async () => {
      incomeRepository.insert.mockResolvedValue({identifiers: [{id:1}]});
      incomeRepository.find.mockResolvedValue(mockReturnedIncome);
      const result = await incomeService.create(mockIncome);

      expect(incomeRepository.insert).toHaveBeenCalledWith(mockIncome);
      expect(incomeRepository.find).toHaveBeenCalledWith({where:[{id:1}]});
      expect(result).toEqual(mockReturnedIncome);
    });
  });
  
  describe('update(): ', () => {
    it('should return updated income', async () => {
      incomeRepository.findOneBy.mockResolvedValue(mockUpdatedIncome);
      const result = await incomeService.update(1, {amount:30});

      expect(incomeRepository.update).toHaveBeenCalledWith(1, {amount:30});
      expect(incomeRepository.findOneBy).toHaveBeenCalledWith({id:1});
      expect(result).toEqual(mockUpdatedIncome);
    });
  });
  
  describe('delete(): ', () => {    
    it('should return deleted income message', async () => {
      const result = await incomeService.delete(1);

      expect(incomeRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(`Income with id 1 deleted`);
    });
  });
});
