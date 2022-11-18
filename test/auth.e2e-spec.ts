import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import fastifyCookie from '@fastify/cookie';
import { User } from '../src/user/user.entity';
import { UserService } from '../src/user/user.service';
import { Roles } from '../src/user/enums/user-roles.enum';
import { mockIncome } from '../src/income/tests/income-data.mock';

describe('AuthController and general auth stuff (e2e)', () => {
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
    
    const userService = await app.get(UserService);
    userService.create({
      username: 'admin',
      password: '12345678',
      passwordConfirmation: '12345678',
      role: Roles.Admin,
    });
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
          payload: { username: "test", role: Roles.User, password: "12345678", passwordConfirmation: "12345678" },
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
    
    it('should return status 401', () => {
      return app
        .inject({
          method: 'POST',
          url: '/auth/login',
          payload: { username: "noSuchUser", password: "12345678" },
        })
        .then((response) => {
          expect(response.statusCode).toEqual(401);
        })
    });
  });
  
  describe('/income (GET)', () => {
    it('should return status 200 if using Auth cookie', () => {
      return app
        .inject({
          method: 'GET',
          url: '/income',
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          expect(response.statusCode).toEqual(200);
        })
    });
    
    it('should return status 401 if not authorized', () => {
      return app
        .inject({
          method: 'GET',
          url: '/income',
        })
        .then((response) => {
          expect(response.statusCode).toEqual(401);
        })
    });
  });
  
  describe('/user (GET)', () => {
    it('should return status 200 if using Auth cookie and proper role', async () => {
      let adminToken;

      await app
        .inject({
          method: 'POST',
          url: '/auth/login',
          payload: { username: 'admin', password: '12345678' },
        }).then((response) => {
          adminToken = response.cookies[0]['value'];
        });
        
      return app
        .inject({
          method: 'GET',
          url: '/user',
          headers: { Authorization: `Bearer ${adminToken}` },
        })
        .then((response) => {
          expect(response.statusCode).toEqual(200);
        })
    });
    
    it('should return status 403 if not admin role', async () => { 
      return app
        .inject({
          method: 'GET',
          url: '/user',
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          expect(response.statusCode).toEqual(403);
        })
    });
  });
});

