import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { CookieSerializeOptions } from '@fastify/cookie';
import { User } from '@prisma/client';
import { JwtFields } from '@collection.io/access-jwt';

import { TOKEN_COOKIE_KEY } from './const';
import { RefreshJwtService } from './refresh-jwt.service';
import { TokenHistoryService } from './token-history.service';
import { DatabaseService } from '@/database';

const COOKIE_OPTIONS: CookieSerializeOptions = {
  sameSite: 'none',
  httpOnly: true,
  secure: false,
};

@Injectable()
export class RefreshService {
  private logger = new Logger('Refresh');

  constructor(
    private jwt: RefreshJwtService,
    private history: TokenHistoryService,
    private db: DatabaseService,
  ) {}

  private extractToken(req: FastifyRequest) {
    if (req.cookies && req.cookies[TOKEN_COOKIE_KEY])
      return req.cookies[TOKEN_COOKIE_KEY];
    else return undefined;
  }

  private clearToken(res: FastifyReply) {
    res.clearCookie(TOKEN_COOKIE_KEY, COOKIE_OPTIONS);
  }

  private async verifyRequest(req: FastifyRequest, res: FastifyReply) {
    const token = this.extractToken(req);
    if (!token) {
      this.logger.log('Token was not found.');
      throw new UnauthorizedException('User unauthorized');
    }

    const payload = this.jwt.verifyToken(token);
    if (!payload) {
      this.logger.log(
        'Token has invalid type and/or signature. Clearing cookie...',
      );
      this.clearToken(res);
      throw new UnauthorizedException('User unauthorized');
    }

    const user = await this.db.user.findUnique({
      where: { id: payload[JwtFields.Id] },
    });

    if (!user) {
      this.logger.log(
        `User with id ${
          payload[JwtFields.Id]
        } was not found. Clearing cookie and history...`,
      );
      this.clearToken(res);
      this.history.invalidateAll(payload[JwtFields.Id]);
      throw new UnauthorizedException('User does not exist');
    }

    if (!(await this.history.checkToken(user.id, token))) {
      this.clearToken(res);
      await this.history.invalidateAll(user.id);
      this.logger.warn(
        `User ${user.id} attempted to refresh with used token. All tokens has been invalidated`,
      );
      throw new ForbiddenException('Attempt to refresh with used token');
    }

    return {
      user,
      token,
    };
  }

  async setRefreshToken(user: User, res: FastifyReply) {
    const token = await this.jwt.createToken(user);
    await this.history.registerToken(user.id, token);

    res.setCookie(TOKEN_COOKIE_KEY, token, COOKIE_OPTIONS);
  }

  async useToken(req: FastifyRequest, res: FastifyReply) {
    const { user, token } = await this.verifyRequest(req, res);
    await this.history.invalidateToken(user.id, token);
    await this.setRefreshToken(user, res);
    this.logger.log(`User ${user.id} updated refresh token`);
    return user;
  }

  async removeToken(req: FastifyRequest, res: FastifyReply) {
    const { user, token } = await this.verifyRequest(req, res);
    await this.history.invalidateToken(user.id, token);
    this.logger.log(`User's ${user.id} token has been invalidated`);
    this.clearToken(res);
  }
}
