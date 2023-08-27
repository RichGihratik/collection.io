import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccessJwtModule } from '@collection.io/access-auth';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AccessJwtModule.forRoot('ACCESS_SECRET'),
  ],
})
export class AppModule {}
