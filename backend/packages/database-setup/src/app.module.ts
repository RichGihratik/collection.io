import { DatabaseModule } from '@collection.io/prisma';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TestService } from './test.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule],
  providers: [TestService],
})
export class AppModule {}
