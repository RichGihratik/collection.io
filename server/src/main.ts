import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import helmet from '@fastify/helmet';
import fastifyCookie from '@fastify/cookie';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const config = app.get(ConfigService);
  app.enableCors({
    origin: config.get<string>('CLIENT_URL'),
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Theres an issue with fastify plugin types, for some reason, the don't work
  /* eslint-disable @typescript-eslint/no-explicit-any */
  await app.register(helmet as any);
  await app.register(fastifyCookie as any);
  /* eslint-enable @typescript-eslint/no-explicit-any */

  await app.listen(3000);
}
bootstrap();
