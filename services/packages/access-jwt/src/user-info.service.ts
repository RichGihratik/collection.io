import { PrismaClient } from '@prisma/client';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

@Injectable()
export class UserInfoService implements OnModuleInit, OnModuleDestroy {
  private client = new PrismaClient();

  async onModuleInit() {
    await this.client.$connect();
  }

  async getUser(id: number) {
    return await this.client.user.findUnique({ where: { id } });
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}
