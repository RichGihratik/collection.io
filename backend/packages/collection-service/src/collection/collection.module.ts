import { Module } from '@nestjs/common';
import { DatabaseModule } from '@collection.io/prisma';
import { CollectionController } from './collection.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CollectionController],
})
export class CollectionModule {}
