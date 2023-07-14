import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TUserInfo } from '@collection.io/access-auth';
import { Collection, UserRole } from '@collection.io/prisma';
import { DatabaseClient } from '@/common';

export async function checkItemPermissions(
  dbx: DatabaseClient,
  user: TUserInfo,
  itemId: number,
): Promise<{ collection: Collection }> {
  const item = await dbx.item.findUnique({
    where: { id: itemId },
    select: {
      collection: true,
    },
  });

  if (!item) throw new NotFoundException('Item was not found!');

  if (user.role !== UserRole.ADMIN && item.collection.ownerId !== user.id)
    throw new ForbiddenException(
      `You don't have permission to change this item`,
    );

  return item;
}
