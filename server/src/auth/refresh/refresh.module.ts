import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import ms from 'ms';

import { REFRESH_SECRET_KEY, REDIS_URL_KEY, EXPIRE_IN } from './const';
import { RefreshJwtService } from './refresh-jwt.service';
import { RefreshService } from './refresh.service';
import { TokenHistoryService } from './token-history.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        store: await redisStore({ url: config.get<string>(REDIS_URL_KEY) }),
        ttl: ms(EXPIRE_IN),
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (cfg: ConfigService) => ({
        secret: cfg.get<string>(REFRESH_SECRET_KEY),
        signOptions: { expiresIn: EXPIRE_IN },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [RefreshJwtService, TokenHistoryService, RefreshService],
  exports: [RefreshService],
})
export class RefreshJwtModule {}
