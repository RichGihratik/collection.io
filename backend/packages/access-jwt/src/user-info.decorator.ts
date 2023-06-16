import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { getUser } from './strategy';
import { PlatformRequest } from './types';

export const UserInfo = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<PlatformRequest>();
    const user = getUser(req);
    if (!user)
      throw new InternalServerErrorException(
        'User info was not found. Be sure to use it on protected route',
      );
    return user;
  },
);
