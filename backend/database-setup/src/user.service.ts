import { randomBytes } from 'crypto';
import { Injectable } from '@nestjs/common';
import { DatabaseService, UserRole } from '@collection.io/prisma';
import { hashPasswordSync } from '@collection.io/access-auth';
import { MsgType, Service, UI } from './service.interface';
import { DirectoryService } from './directory.service';

const passwordLength = 20;

const fileName = 'users.json';

@Injectable()
export class UserService implements Service {
  constructor(
    private db: DatabaseService,
    private dir: DirectoryService,
  ) {}

  private createPassword() {
    return randomBytes(passwordLength).toString('hex');
  }

  async execute(ui: UI): Promise<number> {
    ui.clearDisplay();

    const isReset = await ui.askBool('Reset all?');

    const locale = await ui.askFaker();

    const userCount: number = await ui.askInt('Enter number of users:');
    const adminCount: number = await ui.askInt('Enter number of admins:');

    const userData = Array.from(new Array(userCount), () => {
      const faker = locale();

      return {
        avatarUrl: faker.helpers.maybe(() => faker.image.avatar()),
        name: faker.internet.userName(),
        email: faker.internet.email(),
        password: this.createPassword(),
      };
    });

    const preparedUserData = userData.map((data) => ({
      name: data.name,
      email: data.email,
      avatarUrl: data.avatarUrl,
      hash: hashPasswordSync(data.password),
    }));

    const adminData = Array.from(new Array(adminCount), () => {
      const faker = locale();

      return {
        avatarUrl: faker.helpers.maybe(() => faker.image.avatar()),
        name: faker.internet.userName(),
        email: faker.internet.email(),
        password: this.createPassword(),
      };
    });

    const preparedAdminData = adminData.map((data) => ({
      name: data.name,
      email: data.email,
      avatarUrl: data.avatarUrl,
      role: UserRole.ADMIN,
      hash: hashPasswordSync(data.password),
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

    ui.print('Data has been generated\n', MsgType.Success);
    return isReset ? 3 : 2;
  }
}
