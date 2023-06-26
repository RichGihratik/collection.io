import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccessJwtModule } from '@collection.io/access-jwt';
import { CollectionModule } from './collection';
import { ThemeModule } from './theme';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AccessJwtModule.forRoot('ACCESS_SECRET'),
    CollectionModule,
    ThemeModule,
  ],
})
export class AppModule {}
