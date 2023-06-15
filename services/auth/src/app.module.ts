import { Module } from '@nestjs/common';
import { AuthModule } from './auth';
import { DatabaseModule } from './database';
import { TestController } from './test.controller';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [TestController],
})
export class AppModule {}
