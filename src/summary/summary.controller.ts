import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserId } from '../utils/decorators/user-id.decorator';
import { SummaryService } from './summary.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@ApiTags('Summary Controller')
@UseGuards(JwtAuthGuard)
@Controller('summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get(':year/:month')
  async getSummary(@UserId() userId: number, @Param('year') year: string, @Param('month') month: string) {
    return await this.summaryService.getSummary(userId,year,month);
  }
}
