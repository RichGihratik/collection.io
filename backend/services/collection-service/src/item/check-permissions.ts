import { TUserInfo } from '@collection.io/access-auth';
import { FieldConfig, UserRole } from '@collection.io/prisma';
import { DatabaseClient } from '@/common';
import { ItemForbidden, ItemNotFound } from './exceptions';

type CollectionResult = {
  id: number;
  name: string;
  fields: FieldConfig[];
  ownerId: number;
};

type ItemResult = {
  id: number;
  collection: CollectionResult;
};

export async function checkItemPermissions(
  dbx: DatabaseClient,
  user: TUserInfo,
  itemId: number,
): Promise<ItemResult> {
  const item = await dbx.item.findUnique({
    where: { id: itemId },
    select: {
      id: true,
      collection: {
        select: {
          fields: true,
          id: true,
          name: true,
          ownerId: true,
        },
      },
    },
  });

  if (!item) throw new ItemNotFound();

  if (user.role !== UserRole.ADMIN && item.collection.ownerId !== user.id)
    throw new ItemForbidden();

  return item;
}
