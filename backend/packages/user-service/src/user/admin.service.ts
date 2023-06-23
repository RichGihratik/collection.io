import { DatabaseService, UserRole, UserStatus } from '@collection.io/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  constructor(private db: DatabaseService) {}

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
