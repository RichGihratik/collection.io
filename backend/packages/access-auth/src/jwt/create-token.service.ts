import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtFields, JwtPayload } from './types';
import { TUserInfo } from '../user-info';

@Injectable()
export class CreateTokenService {
  constructor(private jwt: JwtService) {}

  async createToken(user: TUserInfo) {
    const payload = this.userToPayload(user);
    return await this.jwt.signAsync(payload);
  }

  private userToPayload(user: TUserInfo): JwtPayload {
    return {
      [JwtFields.Id]: user.id,
    };
  }
}
