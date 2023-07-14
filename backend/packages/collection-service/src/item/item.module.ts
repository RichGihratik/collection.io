import { DatabaseModule } from '@collection.io/prisma';
import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemSearchService } from './item-search.service';
import { ItemService } from './item.service';

@Module({
  imports: [DatabaseModule],
  providers: [ItemSearchService, ItemService],
  controllers: [ItemController],
})
export class ItemModule {}
