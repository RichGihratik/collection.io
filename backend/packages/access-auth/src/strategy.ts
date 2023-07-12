import { ExecutionContext } from '@nestjs/common';
import { TUserInfo } from './user-info';
import { PlatformRequest } from './types';

// User info
// =================================

const USER_KEY = 'access-user' as const;

function setUser(req: PlatformRequest, user?: TUserInfo) {
  req[USER_KEY] = user;
}

export function getUser(req: PlatformRequest) {
  return req[USER_KEY];
}

// Strategies
// =================================

export interface IStrategy {
  verify(ctx: ExecutionContext): boolean | Promise<boolean>;
}

export const strategyStore = new Map<string, IStrategy>();

export abstract class Strategy implements IStrategy {
  constructor(key: string) {
    strategyStore.set(key, this);
  }

  protected abstract validate(
    _req: PlatformRequest,
    _ctx: ExecutionContext,
  ): Promise<TUserInfo | undefined> | TUserInfo | undefined;

  async verify(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<PlatformRequest>();
    const user = await this.validate(req, ctx);
    if (!user) return false;
    setUser(req, user);
    return true;
  }
}
