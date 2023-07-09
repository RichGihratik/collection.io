import { DatabaseModule } from '@collection.io/prisma';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TestService } from './test.service';
import { AppService } from './app.service';
import { ThemeService } from './theme.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule],
  providers: [AppService, TestService, ThemeService],
})
export class AppModule {}
