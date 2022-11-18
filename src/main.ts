import * as dotenv from 'dotenv'
dotenv.config()

import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import fastifyCookie from '@fastify/cookie';
import { UserService } from './user/user.service';
import { Roles } from './user/enums/user-roles.enum';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.register(fastifyCookie, {
    secret: 'my-secret',
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  const userService = await app.get(UserService);
  if (!userService.findOneByUsername(process.env.ADMIN_USER)) {
    userService.create({
      username: process.env.ADMIN_USER,
      password: process.env.ADMIN_PASS,
      passwordConfirmation: process.env.ADMIN_PASS,
      role: Roles.Admin,
    });
  }
}
bootstrap();
