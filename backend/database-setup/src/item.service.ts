import { Injectable } from '@nestjs/common';
import { Faker } from '@faker-js/faker';
import { DatabaseService, FieldConfig, FieldType } from '@collection.io/prisma';
import { MsgType, Service, UI } from './service.interface';

@Injectable()
export class ItemService implements Service {
  constructor(private db: DatabaseService) {}

  private createWord(faker: Faker) {
    return faker.lorem.word({ length: { min: 5, max: 40 } });
  }

  private createFieldValues(fields: FieldConfig[], faker: Faker) {
    return fields.map((field) => {
      let value = '';

      switch (field.type) {
        case FieldType.BOOL:
          value = faker.helpers.arrayElement([true, false]).toString();
          break;
        case FieldType.DATE:
          value = faker.date.anytime().toISOString();
          break;
        case FieldType.INT:
          value = faker.number.int({ min: 0, max: 12000 }).toString();
          break;
        case FieldType.RICH_TEXT:
          value = faker.lorem.paragraph({ min: 5, max: 50 });
          break;
        case FieldType.TEXT:
          value = this.createWord(faker);
          break;
      }

      return {
        fieldName: field.name,
        collectionId: field.collectionId,
        value,
      };
    });
  }

  async execute(ui: UI): Promise<number> {
    ui.clearDisplay();

    const isReset = await ui.askBool('Reset all?');
    ui.clearDisplay();

    const isTagReset = await ui.askBool('Reset tags?');
    ui.clearDisplay();

    const locale = await ui.askFaker();
    ui.clearDisplay();

    const count = await ui.askInt('Enter count of generated items:');
    ui.clearDisplay();

    const tagsCount = await ui.askInt('Enter count of new tags:');
    ui.clearDisplay();

    const collections = await this.db.collection.findMany({
      select: {
        id: true,
        fields: {
          select: {
            collectionId: true,
            name: true,
            type: true,
          },
        },
      },
    });

    if (isReset) {
      await this.db.item.deleteMany();
      ui.print('Items has been reset', MsgType.Success);
    }

    if (isTagReset) {
      await this.db.itemTag.deleteMany();
      ui.print('Tags has been reset', MsgType.Success);
    }

    // Select tags and generate random new

    const newTags = Array.from(new Array(tagsCount), () => {
      const faker = locale();
      return this.createWord(faker);
    });

    const oldTags = !isTagReset
      ? (await this.db.itemTag.findMany()).map((tag) => tag.name)
      : [];

    const data = Array.from(new Array(count), () => {
      const faker = locale();

      const collection = faker.helpers.arrayElement(collections);

      return {
        name: this.createWord(faker),
        collectionId: collection.id,
        tags: faker.helpers.arrayElements(newTags.concat(oldTags), {
          min: 0,
          max: 10,
        }),
        fields: this.createFieldValues(collection.fields, faker),
      };
    });

    await this.db.itemTag.createMany({
      data: newTags.map((tag) => ({ name: tag })),
      skipDuplicates: true,
    });

    ui.print('Tags has been created', MsgType.Success);

    const progressUpdate = ui.setProgress('Creating items...', count);
    let progress = 0;

    for (const item of data) {
      await this.db.item.create({
        data: {
          name: item.name,
          collectionId: item.collectionId,
          tags: {
            connect: item.tags.map((tag) => ({
              name: tag,
            })),
          },
          fields: {
            createMany: {
              data: item.fields,
            },
          },
        },
      });
      progressUpdate(++progress);
    }

    ui.print('Items created successfully', MsgType.Success);
    return 1;
  }
}
