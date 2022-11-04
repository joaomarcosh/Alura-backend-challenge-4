import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Income } from './income/income.entity';
import { IncomeModule } from './income/income.module';
import { Expense } from './expense/expense.entity';
import { ExpenseModule } from './expense/expense.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 4321,
      username: 'pguser',
      password: 'pgpassword',
      database: 'alura',
      entities: [Income, Expense],
      dropSchema: true,
      synchronize: true,
      autoLoadEntities: true,
    }),
    IncomeModule,
    ExpenseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
