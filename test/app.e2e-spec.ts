import { Test, TestingModule } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { mockIncome, mockReturnedIncome, mockUpdatedIncome } from '../src/income/tests/income-data.mock';

describe('AppController (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });
  
  it('/income (POST)', () => {
    return app
      .inject({
        method: 'POST',
        url: '/income',
        payload: [mockIncome,mockIncome],
      })
      .then((result) => {
        expect(result.statusCode).toEqual(201);
        
        const results = JSON.parse(result.payload);

        results.forEach(r => {
          r.date = new Date(r.date);
          expect(r).toMatchObject({
            id: expect.any(Number),
            description: expect.any(String),
            amount: expect.any(Number),
            date: expect.any(Date),
          });
        });
      });
  });
  
  it('/income (GET)', () => {
    return app
      .inject({
        method: 'GET',
        url: '/income',
      })
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        
        const results = JSON.parse(result.payload);

        results.forEach(r => {
          r.date = new Date(r.date);
          expect(r).toMatchObject({
            id: expect.any(Number),
            description: expect.any(String),
            amount: expect.any(Number),
            date: expect.any(Date),
          });
        });
      });
  });
  
  it('/income/1 (PUT)', () => {
    return app
      .inject({
        method: 'PUT',
        url: '/income/1',
        payload: { amount: 30 },
      })
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        
        const results = JSON.parse(result.payload);

        results.date = new Date(results.date);
        expect(results).toMatchObject({
          id: expect.any(Number),
          description: expect.any(String),
          amount: 30,
          date: expect.any(Date),
        });
      });
  });
  
  it('/income/2 (GET)', () => {
    return app
      .inject({
        method: 'GET',
        url: '/income/2',
      })
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        
        const results = JSON.parse(result.payload);

        results.date = new Date(results.date);
        expect(results).toMatchObject({
          id: expect.any(Number),
          description: expect.any(String),
          amount: 20,
          date: expect.any(Date),
        });
      });
  });
  
  it('/income/2 (DELETE)', () => {
    return app
      .inject({
        method: 'DELETE',
        url: '/income/2',
      })
      .then((result) => {
        expect(result.statusCode).toEqual(200);

        expect(result.payload).toEqual('Income with id 2 deleted');
      });
  });
  
  afterAll(async () => {
    await app.close();
  });
});
