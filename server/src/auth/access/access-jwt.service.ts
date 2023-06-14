import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { FastifyRequest } from 'fastify';

import { RawJwt, AccessJwt, RawFields } from './access-jwt.interface';
import { isValidPayload } from './typeguards';

@Injectable()
export class AccessJwtService {
  constructor(private jwt: JwtService) {}

  async createAccessToken(user: User) {
    const payload: RawJwt = this.userToPayload(user);
    return await this.jwt.signAsync(payload);
  }

  verifyRequest(req: FastifyRequest): AccessJwt | undefined {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const payload = this.jwt.verify(token);
      if (!isValidPayload(payload)) return undefined;
      return this.remapPayload(payload);
    } catch (e) {
      return undefined;
    }
  }

  private remapPayload(item: RawJwt): AccessJwt {
    return {
      id: item[RawFields.Id],
      email: item[RawFields.Email],
      name: item[RawFields.Name],
      role: item[RawFields.Role],
    };
  }

  private userToPayload(user: User): RawJwt {
    return {
      [RawFields.Id]: user.id,
      [RawFields.Email]: user.email,
      [RawFields.Name]: user.name,
      [RawFields.Role]: user.role,
    };
  }
}
