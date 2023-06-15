import { ExecutionContext } from '@nestjs/common';

export interface IStrategy {
  verify(ctx: ExecutionContext): boolean | Promise<boolean>;
}

export const strategyStore = new Map<string, IStrategy>();

export function Strategy(key: string): { new (): IStrategy } {
  class StrategyClass implements IStrategy {
    constructor() {
      strategyStore.set(key, this);
    }

    verify(): boolean | Promise<boolean> {
      return true;
    }
  }

  return StrategyClass;
}
