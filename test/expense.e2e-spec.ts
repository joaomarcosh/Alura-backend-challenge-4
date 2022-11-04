import { Test, TestingModule } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { mockExpense, mockReturnedExpense, mockUpdatedExpense } from '../src/expense/tests/expense-data.mock';

describe('ExpenseController (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });
  
  describe('/expense (POST)', () => {
    it('should return status 201 and created expense', () => {
    return app
      .inject({
        method: 'POST',
        url: '/expense',
        payload: mockExpense,
      })
      .then((response) => {
        expect(response.statusCode).toEqual(201);
        
        const results = JSON.parse(response.payload);

        results.forEach(r => {
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
  
  describe('/expense (GET)', () => {
    it('should return status 200 and all expenses', () => {
    return app
      .inject({
        method: 'GET',
        url: '/expense',
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
        });
      });
    });
  });
  
  describe('/expense/:id (PUT)', () => {
    it('should return status 200 and updated expense', () => {
    return app
      .inject({
        method: 'PUT',
        url: '/expense/1',
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
  
  describe('/expense/:id (GET)', () => {
    it('should return status 200 and selected expense', () => {
    return app
      .inject({
        method: 'GET',
        url: '/expense/1',
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
  
  describe('/expense/:id (DELETE)', () => {
    it('should return status 200 and message about deleted expense', () => {
    return app
      .inject({
        method: 'DELETE',
        url: '/expense/1',
      })
      .then((response) => {
        expect(response.statusCode).toEqual(200);

        expect(response.payload).toEqual('Expense with id 1 deleted');
      });
  });
  
  it('should return status 200 and message about non-existant id', () => {
    return app
      .inject({
        method: 'DELETE',
        url: '/expense/2',
      })
      .then((response) => {
        expect(response.statusCode).toEqual(200);

        expect(response.payload).toEqual('Expense with id 2 does not exist');
      });
  });
  });
  
  
  afterAll(async () => {
    await app.close();
  });
});
