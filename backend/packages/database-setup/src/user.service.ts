import { randomBytes } from 'crypto';
import { Faker, fakerEN, fakerRU } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { hashSync } from 'bcrypt';
import { DatabaseService, UserRole } from '@collection.io/prisma';
import { MsgType, Service, UI } from './service.interface';
import { DirectoryService } from './directory.service';

const passwordLength = 20;

const fileName = 'users.json';

@Injectable()
export class UserService implements Service {
  constructor(private db: DatabaseService, private dir: DirectoryService) {}

  private createPassword() {
    return randomBytes(passwordLength).toString('hex');
  }

  private hashPassword(password: string) {
    const saltRounds = 10;
    return hashSync(password, saltRounds);
  }

  async execute(ui: UI): Promise<number> {
    ui.clearDisplay();

    const isReset = await ui.askReset();

    const locale = await ui.askLocale();

    const userCount: number = await ui.askInt('Enter number of users:');
    const adminCount: number = await ui.askInt('Enter number of admins:');

    const userData = Array.from(new Array(userCount), () => {
      const faker = locale();

      return {
        name: faker.internet.userName(),
        email: faker.internet.email(),
        password: this.createPassword(),
      };
    });

    const preparedUserData = userData.map((data) => ({
      name: data.name,
      email: data.email,
      hash: this.hashPassword(data.password),
    }));

    const adminData = Array.from(new Array(adminCount), () => {
      const faker = locale();

      return {
        name: faker.internet.userName(),
        email: faker.internet.email(),
        password: this.createPassword(),
      };
    });

    const preparedAdminData = adminData.map((data) => ({
      name: data.name,
      email: data.email,
      role: UserRole.ADMIN,
      hash: this.hashPassword(data.password),
    }));

    // Perform transaction
    await this.db.$transaction(async (dbx) => {
      ui.clearDisplay();
      if (isReset) {
        await dbx.user.deleteMany();
        ui.print('Users has been reset', MsgType.Success);
      }
      await dbx.user.createMany({ data: preparedUserData });
      await dbx.user.createMany({ data: preparedAdminData });
    });

    await this.dir.updateFile(
      fileName,
      this.dir.formatJson({
        users: userData,
        admins: adminData,
      }),
    );

    ui.print('Data has been generated', MsgType.Success);
    return isReset ? 2 : 1;
  }
}
