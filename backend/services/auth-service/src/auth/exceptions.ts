import { BadRequestException, HttpStatus } from '@nestjs/common';

export class IncorrectCredentials extends BadRequestException {
  constructor() {
    super({
      status: HttpStatus.BAD_REQUEST,
      message: 'Incorrect email and/or password',
      messageCode: 'auth.incorrectCredentials',
    });
  }
}

export class AccountExists extends BadRequestException {
  constructor() {
    super({
      status: HttpStatus.BAD_REQUEST,
      message: 'User with this email already exists',
      messageCode: 'auth.accountExists',
    });
  }
}
