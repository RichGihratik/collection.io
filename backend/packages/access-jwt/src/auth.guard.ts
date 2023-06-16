import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { STRATEGY_KEY } from './access.strategy';
import { strategyStore } from './strategy';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext) {
    const strategy = strategyStore.get(STRATEGY_KEY);
    if (!strategy)
      throw new InternalServerErrorException(
        `Cant load strategy by key ${STRATEGY_KEY}`,
      );
    return await strategy.verify(ctx);
  }
}
