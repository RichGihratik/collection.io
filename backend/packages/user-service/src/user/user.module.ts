import { Module } from '@nestjs/common';
import { AccessJwtModule } from '@collection.io/access-jwt';
import { DatabaseModule } from '@collection.io/prisma';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [AccessJwtModule.forRoot('ACCESS_SECRET'), DatabaseModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
