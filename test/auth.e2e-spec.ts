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

describe('AuthController (e2e)', () => {
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
    await app.register(fastifyCookie);
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });
  
  afterAll(async () => {
    await app.close();
  });
  
  describe('/auth/signup (POST)', () => {
    it('should return status 201 and created user', () => {
      return app
        .inject({
          method: 'POST',
          url: '/auth/signup',
          payload: { username: "test", password: "12345678", passwordConfirmation: "12345678" },
        })
        .then((response) => {
          expect(response.statusCode).toEqual(201);
        })
    });
    
    it('should return status 422', () => {
      return app
        .inject({
          method: 'POST',
          url: '/auth/signup',
          payload: { username: "teste", password: "12345678", passwordConfirmation: "1234567" },
        })
        .then((response) => {
          expect(response.statusCode).toEqual(422);
        })
    });
  });
  
  describe('/auth/login (POST)', () => {
    it('should return status 204 and token in cookie', () => {
      return app
        .inject({
          method: 'POST',
          url: '/auth/login',
          payload: { username: "test", password: "12345678" },
        })
        .then((response) => {
          token = response.cookies[0]['value'];
          
          expect(response.statusCode).toEqual(204);
          expect(token).toEqual(expect.any(String));
        })
    });
  });
});

