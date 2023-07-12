import {
  CallHandler,
  ExecutionContext,
  InternalServerErrorException,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { STRATEGY_KEY } from '../access.strategy';
import { strategyStore } from '../strategy';

export class UserInfoInterceptor implements NestInterceptor {
  async intercept(
    ctx: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const strategy = strategyStore.get(STRATEGY_KEY);
    if (!strategy)
      throw new InternalServerErrorException(
        `Cant load strategy by key ${STRATEGY_KEY}`,
      );

    try {
      await strategy.verify(ctx);
      return next.handle();
    } catch (e) {
      if (e instanceof UnauthorizedException) return next.handle();
      else throw e;
    }
  }
}
