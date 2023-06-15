import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth';
import { DatabaseModule } from './database';
import { TestController } from './test.controller';

@Module({
  imports: [ConfigModule, DatabaseModule, AuthModule],
  controllers: [TestController],
  providers: [],
})
export class AppModule {}
