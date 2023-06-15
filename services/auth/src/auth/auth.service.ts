import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { hash, compare } from 'bcrypt';
import { User } from '@prisma/client';

import { CreateTokenService } from '@collection.io/access-jwt';
import { DatabaseService } from '@/database';
import { SigninDto, SignupDto } from './dto';
import { RefreshService } from './refresh';

@Injectable()
export class AuthService {
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

    if (!user) throw new BadRequestException('Incorrect email and/or password');

    this.checkUserStatus(user);

    const compareResult = await this.comparePasswords(password, user.hash);

    if (!compareResult)
      throw new BadRequestException('Incorrect email and/or password');

    await this.updateLogin(user.id);
    await this.refreshJwt.setRefreshToken(user, res);
    const access = await this.accessJwt.createToken(user);

    return {
      access,
    };
  }

  async signup(res: FastifyReply, dto: SignupDto) {
    const { name, email, password } = dto;

    let user = await this.db.user.findUnique({
      where: { email },
    });

    if (user)
      throw new BadRequestException('User with this email already exists');

    const hash = await this.hashPassword(password);

    user = await this.db.user.create({ data: { name, email, hash } });

    await this.refreshJwt.setRefreshToken(user, res);
    const access = await this.accessJwt.createToken(user);

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
    if (user.status === 'BLOCKED')
      throw new ForbiddenException('Account is blocked');
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
