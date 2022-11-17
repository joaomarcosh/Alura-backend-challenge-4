import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import fastifyCookie from '@fastify/cookie';
import { Connection } from 'typeorm';
import { User } from '../src/user/user.entity';
import { Expense } from '../src/expense/expense.entity';
import { Income } from '../src/income/income.entity';
import { mockIncome } from '../src/income/tests/income-data.mock';
import { mockExpense } from '../src/expense/tests/expense-data.mock';
import { mockSummary } from '../src/summary/tests/summary-data.mock';
import { JwtAuthGuard } from '../src/auth/jwt/jwt-auth.guard';
import { MockJwtGuard } from './mocks/mock-jwt.guard';

describe('SummaryController (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideGuard(JwtAuthGuard)
    .useClass(MockJwtGuard)
    .compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.register(fastifyCookie);
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
    
    const connection = await app.get(Connection);
    await connection.createQueryBuilder()
      .insert()
      .into(Expense)
      .values(mockExpense)
      .execute()
    await connection.createQueryBuilder()
      .insert()
      .into(Income)
      .values({...mockIncome,userId:1})
      .execute()
  });
  
  afterAll(async () => {
    await app.close();
  });
  
  describe('/summary/:year/:month (GET)', () => {
    it('should return status 200 and summary of specified month', () => {
      return app
        .inject({
          method: 'GET',
          url: '/summary/2022/10',
        })
        .then((response) => {
          expect(response.statusCode).toEqual(200);

          const results = JSON.parse(response.payload);

          expect(results).toMatchObject(mockSummary);
        });
    });
  });
});
