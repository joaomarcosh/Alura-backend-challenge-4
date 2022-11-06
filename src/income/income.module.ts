import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Income } from './income.entity';
import { IncomeService } from './income.service';
import { IncomeController } from './income.controller';
import { IncomeRepository } from './income.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Income])],
  providers: [IncomeService, IncomeRepository],
  controllers: [IncomeController],
  exports: [IncomeService],
})
export class IncomeModule {}
