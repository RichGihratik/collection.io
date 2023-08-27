import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TUserInfo } from '@collection.io/access-auth';
import { DatabaseService, Item } from '@collection.io/prisma';
import { checkCollectionPermissions } from '@/collection';
import { Field, isValidField } from '@/common';
import { CreateItemDto, ItemValues, LikeDto, UpdateItemDto } from './dto';
import { checkItemPermissions } from './check-permissions';
import { sanitize } from 'isomorphic-dompurify';
import { InvalidFields, ItemNotFound } from './exceptions';

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
        throw new InvalidFields();
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

  async update(id: number, dto: UpdateItemDto, user: TUserInfo): Promise<Item> {
    const item = await checkItemPermissions(this.db, user, id);

    if (dto.fields) {
      const values = this.getFieldValues(
        item.collection.fields,
        dto.fields,
        item.collection.id,
      );

      await this.db.$transaction(async (dbx) => {
        for (const value of values) {
          dbx.itemValue.upsert({
            where: {
              itemId_fieldName_collectionId: {
                itemId: item.id,
                collectionId: item.collection.id,
                fieldName: value.fieldName,
              },
            },
            create: {
              itemId: item.id,
              ...value
            },
            update: {
              itemId: item.id,
              ...value
            },
          });
        }
      });
    }

    return await this.db.item.update({
      where: { id },
      data: {
        name: dto.name,
        tags: {
          connectOrCreate: (dto.tags ?? []).map((tag) => ({
            create: {
              name: tag,
            },
            where: {
              name: tag,
            },
          })),
        },
      },
    });
  }

  async like(id: number, dto: LikeDto, user: TUserInfo) {
    const item = await this.db.item.findUnique({
      where: { id }
    });

    if (!item) throw new ItemNotFound();

    await this.db.itemLike.upsert({
      where: {
        itemId_ownerId: {
          itemId: id,
          ownerId: user.id,
        },
      },
      create: {
        itemId: id,
        ownerId: user.id,
        like: dto.like,
      },
      update: {
        like: dto.like,
      },
    });
  }

  async delete(id: number, user: TUserInfo): Promise<Item> {
    return await this.db.$transaction(async (dbx) => {
      await checkItemPermissions(dbx, user, id);
      return await dbx.item.delete({ where: { id } });
    });
  }
}
