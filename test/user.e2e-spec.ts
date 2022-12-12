import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { mockUser } from '../src/user/tests/user-data.mock';
import { JwtAuthGuard } from '../src/auth/jwt/jwt-auth.guard';
import { RoleGuard } from '../src/auth/role/role.guard';

describe('UserController (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({})
      .overrideGuard(RoleGuard)
      .useValue({})
      .compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/user (POST)', () => {
    it('should return status 201 and created user', () => {
      return app
        .inject({
          method: 'POST',
          url: '/user',
          payload: mockUser,
        })
        .then((response) => {
          expect(response.statusCode).toEqual(201);

          const results = JSON.parse(response.payload);

          results.forEach((r) => {
            expect(r).toMatchObject({
              username: expect.any(String),
            });
          });
        });
    });

    it('should return status 409 and error message', () => {
      return app
        .inject({
          method: 'POST',
          url: '/user',
          payload: mockUser,
        })
        .then((response) => {
          expect(response.statusCode).toEqual(409);

          const results = JSON.parse(response.payload);

          expect(results.message).toEqual('Username already exists');
        });
    });
  });

  describe('/user (GET)', () => {
    it('should return status 200 and all users', () => {
      return app
        .inject({
          method: 'GET',
          url: '/user',
        })
        .then((response) => {
          expect(response.statusCode).toEqual(200);

          const results = JSON.parse(response.payload);

          results.forEach((r) => {
            expect(r).toMatchObject({
              username: expect.any(String),
            });
          });
        });
    });
  });

  describe('/user/:id (GET)', () => {
    it('should return status 200 and selected user', () => {
      return app
        .inject({
          method: 'GET',
          url: '/user/1',
        })
        .then((response) => {
          expect(response.statusCode).toEqual(200);

          const results = JSON.parse(response.payload);

          expect(results).toMatchObject({
            username: expect.any(String),
          });
        });
    });
  });

  describe('/user/:id (PUT)', () => {
    it('should return status 200 and updated user', () => {
      return app
        .inject({
          method: 'PUT',
          url: '/user/1',
          payload: { password: 'abcdefgh' },
        })
        .then((response) => {
          expect(response.statusCode).toEqual(200);

          const results = JSON.parse(response.payload);

          expect(results).toMatchObject({
            username: expect.any(String),
          });
        });
    });
  });

  describe('/user/:id (DELETE)', () => {
    it('should return status 200 and message about deleted user', () => {
      return app
        .inject({
          method: 'DELETE',
          url: '/user/1',
        })
        .then((response) => {
          expect(response.statusCode).toEqual(200);

          expect(response.payload).toEqual('User with id 1 deleted');
        });
    });

    it('should return status 200 and message about non-existant id', () => {
      return app
        .inject({
          method: 'DELETE',
          url: '/user/2',
        })
        .then((response) => {
          expect(response.statusCode).toEqual(200);

          expect(response.payload).toEqual('User with id 2 does not exist');
        });
    });
  });
});
