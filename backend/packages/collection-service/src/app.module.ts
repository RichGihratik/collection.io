import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccessJwtModule } from '@collection.io/access-auth';
import { CollectionModule } from './collection';
import { ThemeModule } from './theme';
import { TagModule } from './tag';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AccessJwtModule.forRoot('ACCESS_SECRET'),
    CollectionModule,
    TagModule,
    ThemeModule,
  ],
})
export class AppModule {}
