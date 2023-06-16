import { Module } from '@nestjs/common';
import { AuthModule } from './auth';
import { TestController } from './test.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule],
  controllers: [TestController],
})
export class AppModule {}
