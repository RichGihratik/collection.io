import { Module } from '@nestjs/common';
import { DatabaseModule } from '@collection.io/prisma';
import { AccessJwtModule } from '@collection.io/access-jwt';
import { ACCESS_KEY } from '../const';
import { CollectionController } from './collection.controller';

@Module({
  imports: [DatabaseModule, AccessJwtModule.forRoot(ACCESS_KEY)],
  controllers: [CollectionController],
})
export class CollectionModule {}
