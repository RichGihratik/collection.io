import { createHash } from 'crypto';
import { RedisClientType } from 'redis';
import { EXPIRE_IN } from './const';
import ms from 'ms';

const hashAlg = 'SHA3-256';

export function getKeyFromId(id: number) {
  return `user-token-history:${id}`;
}

type Client = ReturnType<RedisClientType['multi']>;

export interface HistoryContext {
  isExist(token: string): Promise<boolean> | boolean;
  add(token: string): Promise<void> | void;
  remove(token: string): Promise<void> | void;
  clearAll(): Promise<void> | void;
}

export type ContextCtor = new (id: number, client?: Client) => HistoryContext;

export function configContext(
  client: RedisClientType,
  salt: string,
): ContextCtor {
  class Context {
    private key = '';
    private client: RedisClientType | Client;

    constructor(id: number, exec?: Client) {
      this.key = getKeyFromId(id);
      this.client = exec ?? client;
    }

    private hashToken(token: string) {
      return createHash(hashAlg)
        .update(token)
        .update(salt)
        .digest()
        .toString('hex');
    }

    async remove(token: string) {
      await this.client.sRem(this.key, this.hashToken(token));
    }

    async isExist(token: string) {
      return await client.sIsMember(this.key, this.hashToken(token));
    }

    async add(token: string) {
      await this.client.sAdd(this.key, this.hashToken(token));
      await this.client.expire(this.key, ms(EXPIRE_IN) / 1000);
    }

    async clearAll() {
      await this.client.del(this.key);
    }
  }

  return Context;
}
