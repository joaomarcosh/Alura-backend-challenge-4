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
import { mockIncome } from '../src/income/tests/income-data.mock';

describe('IncomeController (e2e)', () => {
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

  describe('/income (POST)', () => {
    it('should return status 201 and created income', () => {
      return app
        .inject({
          method: 'POST',
          url: '/income',
          headers: { Authorization: `Bearer ${token}` },
          payload: mockIncome,
        })
        .then((response) => {
          expect(response.statusCode).toEqual(201);

          const results = JSON.parse(response.payload);

          results.forEach((r) => {
            r.date = new Date(r.date);
            expect(r).toMatchObject({
              description: expect.any(String),
              amount: expect.any(Number),
              date: expect.any(Date),
            });
          });
        });
    });
  });

  describe('/income (GET)', () => {
    it('should return status 200 and all incomes', () => {
      return app
        .inject({
          method: 'GET',
          url: '/income',
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          expect(response.statusCode).toEqual(200);

          const results = JSON.parse(response.payload);

          results.forEach((r) => {
            r.date = new Date(r.date);
            expect(r).toMatchObject({
              description: expect.any(String),
              amount: expect.any(Number),
              date: expect.any(Date),
            });
          });
        });
    });
    
    it('should return status 200 and all incomes with matching description', () => {
      return app
        .inject({
          method: 'GET',
          url: '/income?description=test%20income',
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          expect(response.statusCode).toEqual(200);

          const results = JSON.parse(response.payload);

          results.forEach((r) => {
            r.date = new Date(r.date);
            expect(r).toMatchObject({
              description: 'test income',
              amount: expect.any(Number),
              date: expect.any(Date),
            });
          });
        });
    });
  });
  
  describe('/income/:id (GET)', () => {
    it('should return status 200 and selected income', () => {
      return app
        .inject({
          method: 'GET',
          url: '/income/1',
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          expect(response.statusCode).toEqual(200);

          const results = JSON.parse(response.payload);

          results.date = new Date(results.date);
          expect(results).toMatchObject({
            description: expect.any(String),
            amount: expect.any(Number),
            date: expect.any(Date),
          });
        });
    });
  });
  
  describe('/income/:year/:month (GET)', () => {
    it('should return status 200 and all incomes from specified month', () => {
      return app
        .inject({
          method: 'GET',
          url: '/income/2022/10',
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          expect(response.statusCode).toEqual(200);

          const results = JSON.parse(response.payload);

          results.forEach(r => {
            r.date = new Date(r.date);
            expect(r).toMatchObject({
              description: expect.any(String),
              amount: expect.any(Number),
              date: expect.any(Date),
            });
          })
        });
    });
    
    it('should return status 200 and empty array', () => {
      return app
        .inject({
          method: 'GET',
          url: '/income/2022/01',
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          expect(response.statusCode).toEqual(200);

          const results = JSON.parse(response.payload);

          results.date = new Date(results.date);
          expect(results.length).toBe(0);
        });
    });
  });

  describe('/income/:id (PUT)', () => {
    it('should return status 200 and updated income', () => {
      return app
        .inject({
          method: 'PUT',
          url: '/income/1',
          headers: { Authorization: `Bearer ${token}` },
          payload: { amount: 30 },
        })
        .then((response) => {
          expect(response.statusCode).toEqual(200);

          const results = JSON.parse(response.payload);

          results.date = new Date(results.date);
          expect(results).toMatchObject({
            description: expect.any(String),
            amount: 30,
            date: expect.any(Date),
          });
        });
    });
  });

  describe('/income/:id (DELETE)', () => {
    it('should return status 200 and message about deleted income', () => {
      return app
        .inject({
          method: 'DELETE',
          url: '/income/1',
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          expect(response.statusCode).toEqual(200);

          expect(response.payload).toEqual('Income with id 1 deleted');
        });
    });

    it('should return status 200 and message about non-existant id', () => {
      return app
        .inject({
          method: 'DELETE',
          url: '/income/2',
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          expect(response.statusCode).toEqual(200);

          expect(response.payload).toEqual('Income with id 2 does not exist');
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
