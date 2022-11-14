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

describe('SummaryController (e2e)', () => {
  let app: NestFastifyApplication;
  let token;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.register(fastifyCookie, {
      secret: 'my-secret',
    });
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
      .values(mockIncome)
      .execute()
  });
  
  it('should create an user and log in', async () => {
    const connection = await app.get(Connection);
    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
          {
            username: "test",
            password: "$2a$10$Cd6wOBuD7v4uZy8PqtVT5uuJJi/Qz9hn/3k516zlKuHQEVkuDgNIC",
            salt: "$2a$10$Cd6wOBuD7v4uZy8PqtVT5u"
          }
      ])
      .execute()
      
    return app
        .inject({
          method: 'POST',
          url: '/auth/login',
          payload: { username: "test", password: "12345678" },
        })
        .then((response) => {
          token = response.cookies[0]['value'];
          expect(response.statusCode).toEqual(204);
        })
  });
  
  describe('/summary/:year/:month (GET)', () => {
    it('should return status 200 and summary of specified month', () => {
      return app
        .inject({
          method: 'GET',
          url: '/summary/2022/10',
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          expect(response.statusCode).toEqual(200);

          const results = JSON.parse(response.payload);

          expect(results).toMatchObject(mockSummary);
        });
    });
  });
  
  afterAll(async () => {
    await app.close();
  });
});
