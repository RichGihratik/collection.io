import { Global, Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessJwtModule } from './access';
import { RefreshJwtModule } from './refresh';

@Global()
@Module({
  imports: [AccessJwtModule, RefreshJwtModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AccessJwtModule],
})
export class AuthModule {}
