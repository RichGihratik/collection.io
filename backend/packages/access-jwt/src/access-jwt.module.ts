import { Reflector } from '@nestjs/core';
import { Module, DynamicModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import {
  ConfigModule,
  ConfigModuleOptions,
  ConfigService,
} from '@nestjs/config';
import { DatabaseModule } from '@collection.io/prisma';

import { CreateTokenService, VerifyTokenService } from './jwt';
import { UserInfoService } from './user-info';
import { AccessStrategy } from './access.strategy';

@Module({})
export class AccessJwtModule {
  static forRoot(
    configSecretKey: string,
    configOptions: ConfigModuleOptions = {},
  ): DynamicModule {
    return {
      module: AccessJwtModule,
      imports: [
        DatabaseModule,
        JwtModule.registerAsync({
          imports: [ConfigModule.forRoot(configOptions)],
          inject: [ConfigService],
          useFactory: (cfg: ConfigService) => ({
            secret: cfg.get<string>(configSecretKey),
            signOptions: { expiresIn: '10m' },
          }),
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
