import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccessJwtModule } from '@collection.io/access-auth';
import { CollectionModule } from './collection';
import { ThemeModule } from './theme';
import { TagModule } from './tag';
import { ItemModule } from './item';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AccessJwtModule.forRoot('ACCESS_SECRET'),
    CollectionModule,
    TagModule,
    ItemModule,
    ThemeModule,
  ],
})
export class AppModule {}
