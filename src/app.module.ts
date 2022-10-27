import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Income } from './income/income.entity';
import { IncomeModule } from './income/income.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 4321,
      username: 'pguser',
      password: 'pgpassword',
      database: 'alura',
      entities: [Income],
      synchronize: true,
      autoLoadEntities: true,
    }),
    IncomeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
