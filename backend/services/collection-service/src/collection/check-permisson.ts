import { TUserInfo } from '@collection.io/access-auth';
import { UserRole } from '@collection.io/prisma';
import { DatabaseClient, Field } from '@/common';
import {
  CollectionForbidden,
  CollectionNotFound,
  UserNotFound,
} from './exceptions';

type CollectionType = {
  name: string;
  themeName: string | null;
  ownerId: number;
  description: string;
  fields: Field[];
};

export async function checkCollectionPermissions(
  client: DatabaseClient,
  info: TUserInfo,
  collectionId: number,
  ownerId?: number | null,
): Promise<CollectionType> {
  if (!info)
    throw new Error(
      'CRUD method call without authorization',
    );
  if (ownerId && info.id !== ownerId && info.role !== UserRole.ADMIN) {
    throw new CollectionForbidden();
  } else if (ownerId) {
    const user = await client.user.findUnique({
      where: { id: ownerId },
    });
    if (!user) throw new UserNotFound();
  }

  const collection = await client.collection.findUnique({
    where: { id: collectionId },
    select: {
      name: true,
      themeName: true,
      ownerId: true,
      fields: true,
      description: true,
    },
  });

  if (!collection) throw new CollectionNotFound();

  if (info.role !== UserRole.ADMIN && collection.ownerId !== info.id)
    throw new CollectionForbidden();

  return collection;
}
