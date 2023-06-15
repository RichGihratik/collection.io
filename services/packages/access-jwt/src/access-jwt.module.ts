import { Reflector } from '@nestjs/core';
import { Module, DynamicModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { VerifyTokenService } from './verify-token.service';
import { CreateTokenService } from './create-token.service';
import { UserInfoService } from './user-info.service';
import { AccessStrategy } from './access.strategy';

@Module({})
export class AccessJwtModule {
  static forRoot(configSecretKey: string): DynamicModule {
    return {
      module: AccessJwtModule,
      imports: [
        JwtModule.register({
          secret: process.env[configSecretKey],
          signOptions: { expiresIn: '10m' },
        }),
      ],
      providers: [
        VerifyTokenService,
        UserInfoService,
        CreateTokenService,
        Reflector,
        AccessStrategy,
      ],
      exports: [CreateTokenService],
    };
  }
}
