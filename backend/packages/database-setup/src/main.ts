import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const ui = app.get(AppService);

  await ui.start();
  await app.close();
}
bootstrap();
