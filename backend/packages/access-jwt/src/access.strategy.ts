import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole, UserStatus } from '@collection.io/prisma';

import { VerifyTokenService, JwtFields } from './jwt';
import { ROLES_METAKEY } from './role.decorator';
import { UserInfoService } from './user-info/user-info.service';
import { PlatformRequest } from './types';
import { Strategy } from './strategy';

export const STRATEGY_KEY = 'access-jwt';

@Injectable()
export class AccessStrategy extends Strategy {
  constructor(
    private jwt: VerifyTokenService,
    private reflector: Reflector,
    private db: UserInfoService,
  ) {
    super(STRATEGY_KEY);
  }

  async validate(req: PlatformRequest, ctx: ExecutionContext) {
    const role = this.reflector.get<UserRole>(ROLES_METAKEY, ctx.getHandler());
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new UnauthorizedException('Unauthorized');

    const info = this.jwt.verifyToken(token);
    if (!info) throw new UnauthorizedException('Unauthorized');

    const user = await this.db.getUser(info[JwtFields.Id]);
    if (!user) throw new UnauthorizedException('User not found');

    return (role !== UserRole.ADMIN || user.role === role) &&
      user.status === UserStatus.ACTIVE
      ? user
      : undefined;
  }
}
