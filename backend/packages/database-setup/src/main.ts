import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TestService } from './test.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const test = app.get(TestService);

  console.log(await test.test());
  await app.close();
}
bootstrap();
