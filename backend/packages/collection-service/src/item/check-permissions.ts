import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TUserInfo } from '@collection.io/access-auth';
import { Collection, FieldConfig, UserRole } from '@collection.io/prisma';
import { DatabaseClient } from '@/common';

type CollectionResult = {
  id: number;
  name: string;
  fields: FieldConfig[];
  ownerId: number;
};

type ItemResult = {
  id: number;
  collection: CollectionResult;
}

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
        }
      },
    },
  });

  if (!item) throw new NotFoundException('Item was not found!');

  if (user.role !== UserRole.ADMIN && item.collection.ownerId !== user.id)
    throw new ForbiddenException(
      `You don't have permission to change this item`,
    );

  return item;
}
