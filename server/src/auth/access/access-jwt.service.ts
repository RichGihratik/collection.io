import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { FastifyRequest } from 'fastify';

import { AccessPayload, ParsedAccessPayload } from './access-jwt.interface';
import { JwtFields } from '../jwt-types';
import { isValidPayload } from './typeguards';

@Injectable()
export class AccessJwtService {
  constructor(private jwt: JwtService) {}

  async createAccessToken(user: User) {
    const payload: AccessPayload = this.userToPayload(user);
    return await this.jwt.signAsync(payload);
  }

  verifyRequest(req: FastifyRequest): ParsedAccessPayload | undefined {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const payload = this.jwt.verify(token);
      if (!isValidPayload(payload)) return undefined;
      return this.remapPayload(payload);
    } catch (e) {
      return undefined;
    }
  }

  private remapPayload(item: AccessPayload): ParsedAccessPayload {
    return {
      id: item[JwtFields.Id],
      email: item[JwtFields.Email],
      name: item[JwtFields.Name],
      role: item[JwtFields.Role],
    };
  }

  private userToPayload(user: User): AccessPayload {
    return {
      [JwtFields.Id]: user.id,
      [JwtFields.Email]: user.email,
      [JwtFields.Name]: user.name,
      [JwtFields.Role]: user.role,
    };
  }
}
