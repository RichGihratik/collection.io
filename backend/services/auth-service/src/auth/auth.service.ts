import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { sanitize } from 'isomorphic-dompurify';
import {
  CreateTokenService,
  hashPassword,
  comparePasswords,
} from '@collection.io/access-auth';
import { DatabaseService, User, UserStatus } from '@collection.io/prisma';

import { SigninDto, SignupDto, TokenDto } from './dto';
import { RefreshService } from './refresh';

@Injectable()
export class AuthService {
  private logger = new Logger('Auth');

  constructor(
    private db: DatabaseService,
    private accessJwt: CreateTokenService,
    private refreshJwt: RefreshService,
  ) {}

  async signin(res: FastifyReply, dto: SigninDto): Promise<TokenDto> {
    const { email, password } = dto;

    const user = await this.db.user.findUnique({
      where: { email },
    });

    if (!user) {
      this.logger.log(`Email "${email}" not found when signing in`);
      throw new BadRequestException({
        message: 'Incorrect email and/or password',
        messageCode: 'auth.incorrectCredentials',
      });
    }

    this.checkUserStatus(user);

    const compareResult = await comparePasswords(password, user.hash);

    if (!compareResult) {
      this.logger.log(`Invalid password for "${user.email}"`);
      throw new BadRequestException({
        message: 'Incorrect email and/or password',
        messageCode: 'auth.incorrectCredentials',
      });
    }

    await this.updateLogin(user.id);
    await this.refreshJwt.setRefreshToken(user, res);
    const access = await this.accessJwt.createToken(user);

    this.logger.log(`User "${user.email}" logged in`);

    return {
      access,
      user: {
        ...user,
        avatarUrl: user.avatarUrl ?? undefined,
      },
    };
  }

  async signup(res: FastifyReply, dto: SignupDto): Promise<TokenDto> {
    const { name, email, password } = dto;

    const user = await this.db.$transaction(async (tx) => {
      let user = await tx.user.findUnique({
        where: { email },
      });

      if (user) {
        this.logger.log(`Attempt to sign up with existing email: "${email}"`);
        throw new BadRequestException({
          message: 'User with this email already exists',
          messageCode: 'auth.accountExists',
        });
      }

      const hash = await hashPassword(password);

      user = await tx.user.create({
        data: {
          name: sanitize(name),
          email,
          hash,
        },
      });

      return user;
    });

    await this.refreshJwt.setRefreshToken(user, res);
    const access = await this.accessJwt.createToken(user);

    this.logger.log(`User ${user.email} registered`);

    return {
      access,
      user: {
        ...user,
        avatarUrl: user.avatarUrl ?? undefined,
      },
    };
  }

  async signout(req: FastifyRequest, res: FastifyReply) {
    await this.refreshJwt.removeToken(req, res);
    return 'Logged out sucessfully';
  }

  async refresh(req: FastifyRequest, res: FastifyReply): Promise<TokenDto> {
    const user = await this.refreshJwt.useToken(req, res);
    const access = await this.accessJwt.createToken(user);

    await this.updateLogin(user.id);

    return {
      access,
      user: {
        ...user,
        avatarUrl: user.avatarUrl ?? undefined,
      },
    };
  }

  private checkUserStatus(user: User) {
    if (user.status === UserStatus.BLOCKED) {
      this.logger.log(`Blocked user "${user.email}" attempted to log in`);
      throw new ForbiddenException({
        message: 'Account is blocked',
        messageCode: 'auth.blocked',
      });
    }
  }

  private async updateLogin(id: number) {
    await this.db.user.update({
      where: { id },
      data: {
        lastLogin: new Date(),
      },
    });
  }
}
