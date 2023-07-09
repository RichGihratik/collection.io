import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
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

  await app.register(fastifyCookie as any);
  await app.register(helmet as any);
  await app.listen(3000, 'RENDER' in process.env ? `0.0.0.0` : `localhost`);
}
bootstrap();
