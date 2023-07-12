import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TUserInfo } from '@collection.io/access-jwt';
import { UserRole } from '@collection.io/prisma';
import { DatabaseClient, Field } from '@/common';

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
    throw new InternalServerErrorException(
      'CRUD method call without authorization',
    );
  if (ownerId && info.id !== ownerId && info.role !== UserRole.ADMIN) {
    throw new ForbiddenException({
      message: `You can't assign collection to another user`,
      messageCode: 'collection.forbidden'
    });
  } else if (ownerId) {
    const user = await client.user.findUnique({
      where: { id: ownerId },
    });
    if (!user)
      throw new BadRequestException({
          message: `Can't assign collection to non existing user`,
          messageCode: 'collection.userNotFound'
        }
      );
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

  if (!collection) throw new NotFoundException({
    message: 'Collection was not found!',
    messageCode: 'collection.notFound'
  });

  if (info.role !== UserRole.ADMIN && collection.ownerId !== info.id)
    throw new ForbiddenException({
      message: `You can't assign collection to another user`,
      messageCode: 'collection.forbidden'
    });

  return collection;
}
