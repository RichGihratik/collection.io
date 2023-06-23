import { Module } from '@nestjs/common';
import { AccessJwtModule } from '@collection.io/access-jwt';
import { DatabaseModule } from '@collection.io/prisma';
import { UserController } from './user.controller';

@Module({
  imports: [AccessJwtModule.forRoot('ACCESS_SECRET'), DatabaseModule],
  controllers: [UserController],
})
export class UserModule {}
