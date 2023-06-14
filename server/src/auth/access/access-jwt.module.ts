import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { ACCESS_SECRET_KEY, EXPIRE_IN } from './const';
import { AccessJwtService } from './access-jwt.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (cfg: ConfigService) => ({
        secret: cfg.get<string>(ACCESS_SECRET_KEY),
        signOptions: { expiresIn: EXPIRE_IN },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AccessJwtService],
  exports: [AccessJwtService],
})
export class AccessJwtModule {}
