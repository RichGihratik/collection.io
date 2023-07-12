import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getUser } from '../strategy';
import { PlatformRequest } from '../types';

export const UserInfo = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<PlatformRequest>();
    const user = getUser(req);
    return user;
  },
);
