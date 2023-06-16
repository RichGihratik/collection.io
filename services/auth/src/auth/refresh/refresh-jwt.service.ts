import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@collection.io/prisma';
import { JwtFields, JwtPayload, isJwtPayload } from '@collection.io/access-jwt';

@Injectable()
export class RefreshJwtService {
  constructor(private jwt: JwtService) {}

  async createToken(user: User) {
    return await this.jwt.signAsync(this.userToPayload(user));
  }

  verifyToken(token: string): JwtPayload | undefined {
    try {
      const payload = this.jwt.verify(token);
      if (!isJwtPayload(payload)) return undefined;
      return payload;
    } catch (e) {
      return undefined;
    }
  }

  private userToPayload(user: User): JwtPayload {
    return {
      [JwtFields.Id]: user.id,
    };
  }
}
