import {
  ForbiddenException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';

export class AuthUnauthorised extends UnauthorizedException {
  constructor(message = 'Unauthorized') {
    super({
      message,
      status: HttpStatus.UNAUTHORIZED,
      messageCode: 'auth.unauthorised',
    });
  }
}

export class AuthForbidden extends ForbiddenException {
  constructor(message = 'Forbidden') {
    super({
      message,
      status: HttpStatus.FORBIDDEN,
      messageCode: 'auth.forbidden',
    });
  }
}

export class AuthBlocked extends ForbiddenException {
  constructor() {
    super({
      status: HttpStatus.FORBIDDEN,
      message: 'User is blocked',
      messageCode: 'auth.blocked',
    });
  }
}
