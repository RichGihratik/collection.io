import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CollectionModule } from './collection';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), CollectionModule],
})
export class AppModule {}
