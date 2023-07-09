import { Injectable } from '@nestjs/common';
import { DatabaseService, User } from '@collection.io/prisma';

@Injectable()
export class TestService {
  constructor(private db: DatabaseService) {}

  async test(): Promise<User[]> {
    return this.db.user.findMany();
  }
}
