import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SummaryService } from './summary.service';

@Controller('summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get(':year/:month')
  async getSummary(@Param('year') year: string, @Param('month') month: string) {
    return await this.summaryService.getSummary(year,month);
  }
}
