import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

export class AuthUnauthorised extends UnauthorizedException {
  constructor(message = 'Unauthorized') {
    super({
      message,
      messageCode: 'auth.unauthorised',
    });
  }
}

export class AuthForbidden extends ForbiddenException {
  constructor(message = 'Forbidden') {
    super({
      message,
      messageCode: 'auth.forbidden',
    });
  }
}

export class AuthBlocked extends ForbiddenException {
  constructor() {
    super({
      message: 'User is blocked',
      messageCode: 'auth.blocked',
    });
  }
}
