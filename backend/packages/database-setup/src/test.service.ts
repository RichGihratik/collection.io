import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@collection.io/prisma';
import { Service, UI } from './generator.interface';

@Injectable()
export class TestService implements Service {
  constructor(private db: DatabaseService) {}
  async execute(ui: UI): Promise<void> {
    console.log(await this.db.user.findMany());
    const input = await ui.askString('Have you been eating last night?');
    console.log(`\nAnswer is ${input}`);
  }
}
