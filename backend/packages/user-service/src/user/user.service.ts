import { TUserInfo } from '@collection.io/access-jwt';
import { DatabaseService, UserRole, UserStatus } from '@collection.io/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private db: DatabaseService) {}

  async getUsers(info: TUserInfo) {
    const users = await this.db.user.findMany({
      select: {
        id: true,
        name: true,
        lastLogin: true,
        createdAt: true,
        role: true,
        status: true,
        email: info?.role === UserRole.ADMIN,
      },
    });

    return users;
  }

  async blockUsers(ids: number[]) {
    await this.db.user.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        status: UserStatus.BLOCKED,
      },
    });

    return 'Users blocked successfully';
  }

  async unblockUsers(ids: number[]) {
    await this.db.user.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        status: UserStatus.ACTIVE,
      },
    });

    return 'Users unblocked successfully';
  }

  async deleteUsers(ids: number[]) {
    await this.db.user.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return 'Users deleted successfully';
  }

  async promoteUsers(ids: number[]) {
    await this.db.user.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        role: UserRole.ADMIN,
      },
    });

    return 'Users promoted successfully';
  }

  async downgradeUsers(ids: number[]) {
    await this.db.user.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        role: UserRole.CUSTOMER,
      },
    });

    return 'Users promoted successfully';
  }
}
