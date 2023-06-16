import { DatabaseService } from '@collection.io/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserInfoService {
  constructor(private db: DatabaseService) {}

  async getUser(id: number) {
    return await this.db.user.findUnique({ where: { id } });
  }
}
