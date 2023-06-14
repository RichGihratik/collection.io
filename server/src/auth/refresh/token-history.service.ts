import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { hash } from 'bcrypt';
import { Cache } from 'cache-manager';

enum TokenStatus {
  Valid = 'valid',
}

interface TokenHistory {
  [key: string]: TokenStatus;
}

@Injectable()
export class TokenHistoryService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  private getKeyFromId(id: number) {
    return `${id}:user-token-history`;
  }

  private async getHistory(id: number): Promise<TokenHistory | undefined> {
    return await this.cache.get<TokenHistory>(this.getKeyFromId(id));
  }

  private async setHistory(id: number, history?: TokenHistory) {
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
      delete history[token];
      await this.setHistory(id, history);
    }
  }

  async invalidateAll(id: number) {
    await this.setHistory(id);
  }

  async checkToken(id: number, token: string) {
    const history = await this.getHistory(id);
    const hash = await this.hashToken(token);
    if (history && history[hash] === TokenStatus.Valid) return true;
    else return false;
  }

  async registerToken(id: number, token: string) {
    const history = (await this.getHistory(id)) ?? {};
    const hash = await this.hashToken(token);
    history[hash] = TokenStatus.Valid;
    await this.setHistory(id, history);
  }
}
