import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';

export class UserNotFound extends BadRequestException {
  constructor() {
    super({
      status: HttpStatus.BAD_REQUEST,
      message: `Can't assign collection to non existing user`,
      messageCode: 'collection.userNotFound',
    });
  }
}

export class CollectionForbidden extends ForbiddenException {
  constructor() {
    super({
      status: HttpStatus.FORBIDDEN,
      message: `You are not allowed to perform this action`,
      messageCode: 'collection.forbidden',
    });
  }
}

export class CollectionNotFound extends NotFoundException {
  constructor() {
    super({
      status: HttpStatus.NOT_FOUND,
      message: 'Collection was not found!',
      messageCode: 'collection.notFound',
    });
  }
}
