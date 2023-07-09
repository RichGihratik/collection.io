import { DatabaseModule } from '@collection.io/prisma';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TestService } from './test.service';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule],
  providers: [AppService, TestService],
})
export class AppModule {}
