import { Module } from '@nestjs/common';
import { DatabaseModule } from '@collection.io/prisma';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { FieldConfigService } from './field-config.service';

@Module({
  imports: [DatabaseModule],
  providers: [CollectionService, FieldConfigService],
  controllers: [CollectionController],
})
export class CollectionModule {}
