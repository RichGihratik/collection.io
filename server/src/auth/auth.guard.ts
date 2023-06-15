import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AccessJwtService } from './access';
import { FastifyRequest } from 'fastify';
import { Reflector } from '@nestjs/core';
import { ROLES_METADATA_KEY } from './role.decorator';
import { UserRole } from '@prisma/client';
import { DatabaseService } from '@/database';
import { JwtFields } from './jwt-types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwt: AccessJwtService,
    private db: DatabaseService,
    private reflector: Reflector,
  ) {}

  async canActivate(ctx: ExecutionContext) {
    const role = this.reflector.get<UserRole>(
      ROLES_METADATA_KEY,
      ctx.getHandler(),
    );
    const req = ctx.switchToHttp().getRequest<FastifyRequest>();
    const info = this.jwt.verifyRequest(req);
    if (!info) throw new UnauthorizedException('Unauthorized');
    const user = await this.db.user.findUnique({
      where: { id: info[JwtFields.Id] },
    });
    if (!user) throw new UnauthorizedException('User not found');
    return role !== 'ADMIN' || user.role === role;
  }
}
