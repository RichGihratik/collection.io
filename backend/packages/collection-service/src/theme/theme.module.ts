import { DatabaseModule } from '@collection.io/prisma';
import { Module } from '@nestjs/common';
import { ThemeService } from './theme.service';
import { ThemeController } from './theme.controller';

@Module({
  imports: [DatabaseModule],
  providers: [ThemeService],
  controllers: [ThemeController],
})
export class ThemeModule {}
