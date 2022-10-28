import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Income } from './income.entity';
import { IncomeService } from './income.service';
import { IncomeController } from './income.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Income])],
  providers: [IncomeService],
  controllers: [IncomeController],
})
export class IncomeModule {}
