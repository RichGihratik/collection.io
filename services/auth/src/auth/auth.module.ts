import { Module } from '@nestjs/common';
import { AccessJwtModule } from '@collection.io/access-jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshJwtModule } from './refresh';

@Module({
  imports: [AccessJwtModule.forRoot('ACCESS_SECRET'), RefreshJwtModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
