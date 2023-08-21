import { Injectable } from '@nestjs/common';
import { DatabaseService, UserRole, UserStatus } from '@collection.io/prisma';
import { AdminActionDto } from './dto';

@Injectable()
export class AdminService {
  constructor(private db: DatabaseService) {}

  async update(dto: AdminActionDto) {
    await this.blockUsers(dto.block);
    await this.downgradeUsers(dto.downgrade);
    await this.promoteUsers(dto.promote);
    await this.unblockUsers(dto.unblock);

    return 'Succesfully update table';
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

    return 'Users downgraded successfully';
  }
}
