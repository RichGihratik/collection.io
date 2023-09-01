import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';

export class ItemNotFound extends NotFoundException {
  constructor() {
    super({
      status: HttpStatus.NOT_FOUND,
      message: `Item was not found`,
      messageCode: 'item.notFound',
    });
  }
}

export class ItemForbidden extends ForbiddenException {
  constructor() {
    super({
      status: HttpStatus.FORBIDDEN,
      message: `You aren't allowed to change this item`,
      messageCode: 'item.forbidden',
    });
  }
}

export class InvalidFields extends BadRequestException {
  constructor() {
    super({
      status: HttpStatus.BAD_REQUEST,
      message: `Invalid field types`,
      messageCode: 'fieldValue.invalid',
    });
  }
}
