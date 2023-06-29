import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TUserInfo } from '@collection.io/access-jwt';
import { UserRole } from '@collection.io/prisma';
import { DatabaseClient } from '@/common';

export async function checkCollectionPermissions(
  client: DatabaseClient,
  info: TUserInfo,
  collectionId: number,
  ownerId?: number | null,
) {
  if (!info)
    throw new InternalServerErrorException(
      'CRUD method call without authorization',
    );
  if (ownerId && info.id !== ownerId && info.role !== UserRole.ADMIN) {
    throw new ForbiddenException(`You can't assign collection to another user`);
  } else if (ownerId) {
    const user = await client.user.findUnique({
      where: { id: ownerId },
    });
    if (!user)
      throw new BadRequestException(
        `Can't assign collection to non existing user`,
      );
  }

  const collection = await client.collection.findUnique({
    where: { id: collectionId },
    select: {
      ownerId: true,
    },
  });

  if (!collection) throw new NotFoundException('Collection was not found!');

  if (info.role !== UserRole.ADMIN && collection.ownerId !== info.id)
    throw new ForbiddenException(
      `You can't access collection of another user!`,
    );

  return collection;
}
