import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Income } from './income/income.entity';
import { IncomeModule } from './income/income.module';
import { Expense } from './expense/expense.entity';
import { ExpenseModule } from './expense/expense.module';
import { SummaryModule } from './summary/summary.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import dbConfig from './config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...dbConfig[process.env.NODE_ENV],
        entities: [Income, Expense],
        autoLoadEntities: true,
      }),
    }),
    IncomeModule,
    ExpenseModule,
    SummaryModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
