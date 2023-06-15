import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { UserRole } from '@prisma/client';

import { VerifyTokenService } from './verify-token.service';
import { ROLES_METADATA_KEY } from './role.decorator';
import { UserInfoService } from './user-info.service';
import { JwtFields } from './jwt-types';
import { Strategy } from './strategy';

export const STRATEGY_KEY = 'access-jwt';

@Injectable()
export class AccessStrategy extends Strategy(STRATEGY_KEY) {
  constructor(
    private db: UserInfoService,
    private jwt: VerifyTokenService,
    private reflector: Reflector,
  ) {
    super();
  }

  async verify(ctx: ExecutionContext) {
    const role = this.reflector.get<UserRole>(
      ROLES_METADATA_KEY,
      ctx.getHandler(),
    );
    const req = ctx.switchToHttp().getRequest<FastifyRequest>();
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new UnauthorizedException('Unauthorized');

    const info = this.jwt.verifyRequest(token);
    if (!info) throw new UnauthorizedException('Unauthorized');

    const user = await this.db.getUser(info[JwtFields.Id]);
    if (!user) throw new UnauthorizedException('User not found');
    return role !== 'ADMIN' || user.role === role;
  }
}
