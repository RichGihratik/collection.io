import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { createClient, RedisClientType, WatchError } from 'redis';
import { REDIS_URL_KEY, TOKEN_SALT_KEY } from './const';
import {
  ContextCtor,
  configContext,
  HistoryContext,
  getKeyFromId,
} from './token-history-context';

@Injectable()
export class TokenHistoryService {
  private store: RedisClientType;
  private ctor: ContextCtor;

  constructor(cfg: ConfigService) {
    this.store = createClient({ url: cfg.get<string>(REDIS_URL_KEY) });
    this.ctor = configContext(
      this.store,
      cfg.get<string>(TOKEN_SALT_KEY) ?? '',
    );
  }

  private async checkConnection() {
    if (!this.store.isReady) await this.store.connect();
  }

  // Public methods

  async invalidateToken(id: number, token: string) {
    await this.checkConnection();
    return await new this.ctor(id).remove(token);
  }

  async invalidateAll(id: number) {
    await this.checkConnection();
    return await new this.ctor(id).clearAll();
  }

  async checkToken(id: number, token: string) {
    await this.checkConnection();
    return await new this.ctor(id).isExist(token);
  }

  async registerToken(id: number, token: string) {
    await this.checkConnection();
    return await new this.ctor(id).add(token);
  }

  async execute(id: number, body: (ctx: HistoryContext) => Promise<boolean>) {
    await this.checkConnection();
    const tries = 100;
    for (let i = 0; i < tries; i++) {
      try {
        return await this.store.executeIsolated(async (client) => {
          const store = client.multi();
          const ctx = new this.ctor(id, store);
          await client.watch(getKeyFromId(id));
          const res = await body(ctx);
          await store.exec();
          return res;
        });
      } catch (err) {
        if (!(err instanceof WatchError)) throw err;
      }
    }
    throw new Error('Too much tries to perform transaction!');
  }

  async useToken(id: number, oldToken: string, newToken: string) {
    return await this.execute(id, async (ctx) => {
      if (!(await ctx.isExist(oldToken))) {
        ctx.clearAll();
        return false;
      }
      ctx.remove(oldToken);
      ctx.add(newToken);
      return true;
    });
  }
}
