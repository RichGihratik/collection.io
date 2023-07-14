import { BadRequestException, Injectable } from '@nestjs/common';
import { TUserInfo } from '@collection.io/access-auth';
import { DatabaseService, Item } from '@collection.io/prisma';
import { checkCollectionPermissions } from '@/collection';
import { Field, isValidField } from '@/common';
import { CreateItemDto, ItemValues } from './dto';
import { checkItemPermissions } from './check-permissions';
import { sanitize } from 'isomorphic-dompurify';

@Injectable()
export class ItemService {
  constructor(private db: DatabaseService) {}

  private getFieldValues(
    fields: Field[],
    obj: ItemValues,
    collectionId: number,
  ) {
    return fields.flatMap((field) => {
      if (obj[field.name] === undefined) return [];
      if (!isValidField(obj[field.name], field.type))
        throw new BadRequestException('Invalid field types');
      return {
        collectionId,
        fieldName: field.name,
        value: sanitize(String(obj[field.name])),
      };
    });
  }

  async create(dto: CreateItemDto, user: TUserInfo): Promise<Item> {
    return await this.db.$transaction(async (dbx) => {
      const collection = await checkCollectionPermissions(
        dbx,
        user,
        dto.collectionId,
      );

      return await dbx.item.create({
        data: {
          collectionId: dto.collectionId,
          name: dto.name,
          tags: {
            connectOrCreate: dto.tags.map((tag) => ({
              where: { name: tag },
              create: { name: tag },
            })),
          },
          fields: {
            createMany: {
              data: this.getFieldValues(
                collection.fields,
                dto.fields,
                dto.collectionId,
              ),
            },
          },
        },
      });
    });
  }

  // TODO Create update function
  async update(id: number, dto, user: TUserInfo): Promise<Item> {
    return await this.db.$transaction(async (dbx) => {
      await checkItemPermissions(dbx, user, id);
      return await dbx.item.delete({ where: { id } });
    });
  }

  async delete(id: number, user: TUserInfo): Promise<Item> {
    return await this.db.$transaction(async (dbx) => {
      await checkItemPermissions(dbx, user, id);
      return await dbx.item.delete({ where: { id } });
    });
  }
}
