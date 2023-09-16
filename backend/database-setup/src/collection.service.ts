import { Injectable } from '@nestjs/common';
import { DatabaseService, FieldType } from '@collection.io/prisma';
import { MsgType, Service, UI } from './service.interface';
import { DirectoryService } from './directory.service';
import { Faker } from '@faker-js/faker';

const FILENAME = 'collections.json';

@Injectable()
export class CollectionService implements Service {
  constructor(
    private db: DatabaseService,
    private dir: DirectoryService,
  ) {}

  private generateFields(faker: Faker) {
    const count = faker.number.int({ max: 7, min: 0 });
    return Array.from(new Array(count), () => {
      const type = faker.helpers.arrayElement(
        Object.keys(FieldType) as FieldType[],
      );
      return {
        type,
        name:
          type === FieldType.BOOL
            ? faker.word.adjective()
            : type === FieldType.DATE
            ? faker.word.interjection()
            : faker.word.noun(),
      };
    });
  }

  async execute(ui: UI): Promise<number> {
    ui.clearDisplay();
    const isReset = await ui.askBool('Reset all?');
    ui.clearDisplay();
    const locale = await ui.askFaker();
    ui.clearDisplay();
    const count = await ui.askInt('How much?');

    const themes = (
      await this.db.collectionTheme.findMany({
        select: { name: true },
      })
    ).map((theme) => theme.name);

    const users = (
      await this.db.user.findMany({
        select: { id: true },
      })
    ).map((user) => user.id);

    const data = Array.from(new Array(count), () => {
      const faker = locale();

      return {
        name: faker.word.noun(),
        description: faker.lorem.paragraph({ min: 4, max: 50 }),
        themeName: faker.helpers.arrayElement([...themes, null]),
        ownerId: faker.helpers.arrayElement(users),
        fields: this.generateFields(faker),
        imageUrl: faker.image.url(),
      };
    });

    ui.clearDisplay();
    if (isReset) {
      await this.db.collection.deleteMany();
      ui.print('Collections has been reset', MsgType.Success);
    }
    const progressUpdate = ui.setProgress('Creating collections...', count);
    let progress = 0;

    for (const item of data) {
      await this.db.collection.create({
        data: {
          name: item.name,
          description: item.description,
          ownerId: item.ownerId,
          themeName: item.themeName,
          imageUrl: item.imageUrl,
          fields: {
            createMany: {
              data: item.fields,
              skipDuplicates: true,
            },
          },
        },
      });
      progressUpdate(++progress);
    }

    ui.print('Collections has been created', MsgType.Success);
    await this.dir.updateFile(
      FILENAME,
      this.dir.formatJson({
        collections: data,
      }),
    );
    return 2;
  }
}
