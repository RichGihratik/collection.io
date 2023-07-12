import { Module } from '@nestjs/common';
import { AccessJwtModule } from '@collection.io/access-jwt';
import { DatabaseModule } from '@collection.io/prisma';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [AccessJwtModule.forRoot('ACCESS_SECRET'), DatabaseModule],
  providers: [AdminService, UserService],
  controllers: [AdminController, UserController],
})
export class UserModule {}
