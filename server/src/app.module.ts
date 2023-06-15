import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth';
import { DatabaseModule } from './database';

@Module({
  imports: [ConfigModule, DatabaseModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
