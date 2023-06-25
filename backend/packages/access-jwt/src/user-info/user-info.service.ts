import { DatabaseService } from '@collection.io/prisma';
import { Injectable } from '@nestjs/common';

export type TUserInfo = Exclude<
  Awaited<ReturnType<UserInfoService['getUser']>>,
  null
>;

@Injectable()
export class UserInfoService {
  constructor(private db: DatabaseService) {}

  async getUser(id: number) {
    return await this.db.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
        lastLogin: true,
      },
    });
  }
}
