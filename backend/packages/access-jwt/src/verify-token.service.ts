import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload, isJwtPayload } from './types';

@Injectable()
export class VerifyTokenService {
  constructor(private jwt: JwtService) {}

  verifyToken(token: string): JwtPayload | undefined {
    try {
      const payload = this.jwt.verify(token);
      if (!isJwtPayload(payload)) return undefined;
      return payload;
    } catch (e) {
      return undefined;
    }
  }
}
