import {
  ExecutionContext,
  ForbiddenException,
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
    if (!token)
      throw new UnauthorizedException({
        message: 'Unauthorized',
        messageCode: 'auth.unauthorised',
      });

    const info = this.jwt.verifyToken(token);
    if (!info)
      throw new UnauthorizedException({
        message: 'Unauthorized',
        messageCode: 'auth.unauthorised',
      });

    const user = await this.db.getUser(info[JwtFields.Id]);
    if (!user)
      throw new UnauthorizedException({
        message: 'User not found',
        messageCode: 'auth.unauthorised',
      });

    if (user.status === UserStatus.BLOCKED)
      throw new ForbiddenException({
        message: 'User is blocked',
        messageCode: 'auth.blocked',
      });

    if (role === UserRole.ADMIN && user.role !== role)
      throw new ForbiddenException({
        message: 'Forbidden',
        messageCode: 'auth.forbidden',
      });

    return user;
  }
}
