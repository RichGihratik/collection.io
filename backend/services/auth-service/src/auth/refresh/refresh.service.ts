import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { CookieSerializeOptions } from '@fastify/cookie';
import {
  JwtFields,
  UserInfoSelectQuery,
  TUserInfo,
} from '@collection.io/access-auth';
import { DatabaseService, UserStatus } from '@collection.io/prisma';

import { EXPIRE_IN, TOKEN_COOKIE_KEY } from './const';
import { RefreshJwtService } from './refresh-jwt.service';
import { TokenHistoryService } from './token-history.service';
import ms from 'ms';

const COOKIE_OPTIONS: CookieSerializeOptions = {
  sameSite: 'none',
  httpOnly: true,
  secure: true,
  maxAge: ms(EXPIRE_IN) / 1000,
};

@Injectable()
export class RefreshService {
  private logger = new Logger('Refresh', { timestamp: true });

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
    res.clearCookie(TOKEN_COOKIE_KEY, {
      ...COOKIE_OPTIONS,
      domain: res.request.hostname,
    });
  }

  private setCookie(token: string, res: FastifyReply) {
    res.setCookie(TOKEN_COOKIE_KEY, token, {
      ...COOKIE_OPTIONS,
      domain: res.request.hostname,
    });
  }

  private async verifyRequest(req: FastifyRequest, res: FastifyReply) {
    this.logger.log('Checking token in cookie...');
    const token = this.extractToken(req);
    if (!token) {
      this.logger.log('Token was not found.');
      throw new UnauthorizedException({ 
        message: 'User unauthorized',
        messageCode: 'auth.unauthorised' 
      });
    }

    this.logger.log('Found token in cookie. Verifying token sign...');
    const payload = this.jwt.verifyToken(token);
    if (!payload) {
      this.logger.log(
        'Token has invalid type and/or signature. Clearing cookie...',
      );
      this.clearToken(res);
      throw new UnauthorizedException({ 
        message: 'Token invalid',
        messageCode: 'auth.unauthorised' 
      });
    }

    this.logger.log('Token sign is valid. Checking db info...');
    const user: TUserInfo | null = await this.db.user.findUnique({
      where: { id: payload[JwtFields.Id] },
      select: UserInfoSelectQuery,
    });

    if (!user) {
      this.logger.log(
        `User with id ${
          payload[JwtFields.Id]
        } was not found. Clearing cookie and history...`,
      );
      this.clearToken(res);
      await this.history.invalidateAll(payload[JwtFields.Id]);
      throw new UnauthorizedException({ 
        message: 'User does not exist',
        messageCode: 'auth.unauthorised' 
      });
    } else if (user.status === UserStatus.BLOCKED) {
      this.logger.log(`User "${user.email}" is blocked. Clearing cookie...`);
      this.clearToken(res);
      await this.history.invalidateAll(user.id);
      throw new ForbiddenException({ 
        message: 'User is blocked',
        messageCode: 'auth.blocked' 
      });
    }

    this.logger.log(`Token of "${user.email}" is valid`);
    return {
      user,
      token,
    };
  }

  async setRefreshToken(user: TUserInfo, res: FastifyReply) {
    const token = await this.jwt.createToken(user);
    await this.history.registerToken(user.id, token);
    this.setCookie(token, res);
  }

  async useToken(req: FastifyRequest, res: FastifyReply) {
    const { user, token } = await this.verifyRequest(req, res);
    const newToken = await this.jwt.createToken(user);
    this.logger.log(`Checking token history and updating token...`);
    if (!(await this.history.useToken(user.id, token, newToken))) {
      this.clearToken(res);
      this.logger.warn(
        `User ${user.email} attempted to refresh with used token. All tokens has been invalidated`,
      );
      throw new ForbiddenException({ 
        message: 'Attempt to refresh with used token',
        messageCode: 'auth.usedRefresh' 
      });
    }
    this.setCookie(newToken, res);
    this.logger.log(`User ${user.email} updated refresh token`);
    return user;
  }

  async removeToken(req: FastifyRequest, res: FastifyReply) {
    const { user, token } = await this.verifyRequest(req, res);
    await this.history.invalidateToken(user.id, token);
    this.logger.log(`User's ${user.email} token has been invalidated`);
    this.clearToken(res);
  }
}
