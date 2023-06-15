import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

import { JwtFields, JwtPayload } from './jwt-types';

@Injectable()
export class CreateTokenService {
  constructor(private jwt: JwtService) {}

  async createToken(user: User) {
    const payload = this.userToPayload(user);
    return await this.jwt.signAsync(payload);
  }

  private userToPayload(user: User): JwtPayload {
    return {
      [JwtFields.Id]: user.id,
    };
  }
}
