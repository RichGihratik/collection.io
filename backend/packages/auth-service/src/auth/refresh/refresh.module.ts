import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DatabaseModule } from '@collection.io/prisma';

import { REFRESH_SECRET_KEY, EXPIRE_IN } from './const';
import { RefreshJwtService } from './refresh-jwt.service';
import { RefreshService } from './refresh.service';
import { TokenHistoryService } from './token-history.service';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (cfg: ConfigService) => ({
        secret: cfg.get<string>(REFRESH_SECRET_KEY),
        signOptions: { expiresIn: EXPIRE_IN },
      }),
    }),
  ],
  providers: [RefreshJwtService, TokenHistoryService, RefreshService],
  exports: [RefreshService],
})
export class RefreshJwtModule {}
