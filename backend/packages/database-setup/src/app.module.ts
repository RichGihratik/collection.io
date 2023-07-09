import { DatabaseModule } from '@collection.io/prisma';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { ThemeService } from './theme.service';
import { DirectoryService } from './directory.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule],
  providers: [AppService, DirectoryService, ThemeService],
})
export class AppModule {}
