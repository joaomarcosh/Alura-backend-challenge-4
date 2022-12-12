import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import fastifyCookie from '@fastify/cookie';
import { UserService } from './user/user.service';
import { Roles } from './user/enums/user-roles.enum';
import ServerConfig from './config/server.config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.register(fastifyCookie, {
    secret: 'my-secret',
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Alura backend challenge 4')
    .setDescription('Challenge API')
    .setVersion('1.0')
    .addTag('Income Controller')
    .addTag('Expense Controller')
    .addTag('Summary Controller')
    .addTag('User Controller')
    .addTag('Auth Controller')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, ServerConfig[process.env.NODE_ENV]['host']);

  const userService = await app.get(UserService);
  const adminExists = await userService.findOneByUsername(
    process.env.ADMIN_USER,
  );
  if (!adminExists) {
    userService.create({
      username: process.env.ADMIN_USER,
      password: process.env.ADMIN_PASS,
      role: Roles.Admin,
    });
  }
}
bootstrap();
