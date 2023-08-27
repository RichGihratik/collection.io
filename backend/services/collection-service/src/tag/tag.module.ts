import { Module } from '@nestjs/common';
import { DatabaseModule } from '@collection.io/prisma';
import { TagController } from './tag.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [TagController],
})
export class TagModule {}
