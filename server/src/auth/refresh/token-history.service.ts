import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { hash, compare } from 'bcrypt';
import { Cache } from 'cache-manager';

@Injectable()
export class TokenHistoryService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  private getKeyFromId(id: number) {
    return `${id}:user-token-history`;
  }

  private async getHistory(id: number): Promise<string[] | undefined> {
    return await this.cache.get<string[]>(this.getKeyFromId(id));
  }

  private async setHistory(id: number, history?: string[]) {
    if (history) await this.cache.set(this.getKeyFromId(id), history);
    else await this.cache.del(this.getKeyFromId(id));
  }

  private async hashToken(token: string) {
    const saltRounds = 10;
    return await hash(token, saltRounds);
  }

  async invalidateToken(id: number, token: string) {
    const history = await this.getHistory(id);
    if (history) {
      for (const [index, item] of history.entries()) {
        if (await compare(token, item)) history.splice(index, 1);
      }
      await this.setHistory(id, history);
    }
  }

  async invalidateAll(id: number) {
    await this.setHistory(id);
  }

  async checkToken(id: number, token: string) {
    const history = await this.getHistory(id);

    if (!history) return false;

    for (const item of history) {
      if (await compare(token, item)) return true;
    }

    return false;
  }

  async registerToken(id: number, token: string) {
    const history = (await this.getHistory(id)) ?? [];
    const hash = await this.hashToken(token);
    history.push(hash);
    await this.setHistory(id, history);
  }
}
