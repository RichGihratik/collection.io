import { ExecutionContext } from '@nestjs/common';
import { User } from '@collection.io/prisma';
import { PlatformRequest } from './types';

// User info
// =================================

const USER_KEY = 'access-user' as const;

function setUser(req: PlatformRequest, user?: User) {
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

export function Strategy(key: string): { new (): IStrategy } {
  class StrategyClass implements IStrategy {
    constructor() {
      strategyStore.set(key, this);
    }

    protected validate(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _req: PlatformRequest,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _ctx: ExecutionContext,
    ): Promise<User | undefined> | User | undefined {
      return undefined;
    }

    async verify(ctx: ExecutionContext): Promise<boolean> {
      const req = ctx.switchToHttp().getRequest<PlatformRequest>();
      const user = await this.validate(req, ctx);
      if (!user) return false;
      setUser(req, user);
      return true;
    }
  }

  return StrategyClass;
}
