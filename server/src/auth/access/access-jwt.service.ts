import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { FastifyRequest } from 'fastify';

import { JwtFields, JwtPayload, isJwtPayload } from '../jwt-types';

@Injectable()
export class AccessJwtService {
  constructor(private jwt: JwtService) {}

  async createToken(user: User) {
    const payload = this.userToPayload(user);
    return await this.jwt.signAsync(payload);
  }

  verifyRequest(req: FastifyRequest): JwtPayload | undefined {
    const token = req.headers.authorization.split(' ')[1];
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
