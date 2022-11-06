import { Test, TestingModule } from '@nestjs/testing';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { SummaryController } from '../summary.controller';
import { SummaryService } from '../summary.service';
import { mockSummary } from './summary-data.mock';

const moduleMocker = new ModuleMocker(global);

describe('SummaryController: ', () => {
  let summaryController: SummaryController;
  let summaryService: SummaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SummaryController],
    }).useMocker((token) => {
        //define return values here
        if (token == SummaryService) {
          return {
            getSummary: jest.fn().mockResolvedValue(mockSummary),
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

    summaryController = module.get<SummaryController>(SummaryController);
    summaryService = module.get<SummaryService>(SummaryService);
  });

  it('should be defined', () => {
    expect(summaryController).toBeDefined();
  });
  
  describe('getSummary(): ', () => {
    it('should return summary of specified month', async () => {
      const result = await summaryController.getSummary('2022','10');

      expect(summaryService.getSummary).toHaveBeenCalledWith('2022','10');
      expect(result).toBe(mockSummary);
    });
  });
});
