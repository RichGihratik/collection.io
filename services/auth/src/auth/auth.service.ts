import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { hash, compare } from 'bcrypt';
import { CreateTokenService } from '@collection.io/access-jwt';
import { DatabaseService, User } from '@collection.io/prisma';

import { SigninDto, SignupDto } from './dto';
import { RefreshService } from './refresh';

@Injectable()
export class AuthService {
  private logger = new Logger('Auth');

  constructor(
    private db: DatabaseService,
    private accessJwt: CreateTokenService,
    private refreshJwt: RefreshService,
  ) {}

  async signin(res: FastifyReply, dto: SigninDto) {
    const { email, password } = dto;

    const user = await this.db.user.findUnique({
      where: { email },
    });

    if (!user) {
      this.logger.log(`Email "${email}" not found when signing in`);
      throw new BadRequestException('Incorrect email and/or password');
    }

    this.checkUserStatus(user);

    const compareResult = await this.comparePasswords(password, user.hash);

    if (!compareResult) {
      this.logger.log(`Invalid password for "${user.email}"`);
      throw new BadRequestException('Incorrect email and/or password');
    }

    await this.updateLogin(user.id);
    await this.refreshJwt.setRefreshToken(user, res);
    const access = await this.accessJwt.createToken(user);

    this.logger.log(`User "${user.email}" logged in`);

    return {
      access,
    };
  }

  async signup(res: FastifyReply, dto: SignupDto) {
    const { name, email, password } = dto;

    let user = await this.db.user.findUnique({
      where: { email },
    });

    if (user) {
      this.logger.log(
        `Attempt to sign up with existing email: "${user.email}"`,
      );
      throw new BadRequestException('User with this email already exists');
    }

    const hash = await this.hashPassword(password);

    user = await this.db.user.create({ data: { name, email, hash } });

    await this.refreshJwt.setRefreshToken(user, res);
    const access = await this.accessJwt.createToken(user);

    this.logger.log(`User ${user.email} registered`);

    return {
      access,
    };
  }

  signout(req: FastifyRequest, res: FastifyReply) {
    this.refreshJwt.removeToken(req, res);
    return 'Logged out sucessfully';
  }

  async refresh(req: FastifyRequest, res: FastifyReply) {
    const user = await this.refreshJwt.useToken(req, res);
    const access = await this.accessJwt.createToken(user);

    await this.updateLogin(user.id);

    return {
      access,
    };
  }

  private checkUserStatus(user: User | undefined) {
    if (user.status === 'BLOCKED') {
      this.logger.log(`Blocked user "${user.email}" attempted to log in`);
      throw new ForbiddenException('Account is blocked');
    }
  }

  private async hashPassword(password: string) {
    const saltRounds = 10;
    return await hash(password, saltRounds);
  }

  private async comparePasswords(password: string, hash: string) {
    return await compare(password, hash);
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
