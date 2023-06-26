import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { TUserInfo } from '@collection.io/access-jwt';
import { DatabaseService, UserRole } from '@collection.io/prisma';

export async function checkPermissions(
  client: Parameters<Parameters<DatabaseService['$transaction']>[0]>[0],
  info: TUserInfo,
  collectionId: number,
  ownerId?: number | null,
) {
  if (!info)
    throw new InternalServerErrorException(
      'CRUD method call without authorization',
    );
  if (ownerId && info.id !== ownerId && info.role !== UserRole.ADMIN) {
    throw new ForbiddenException(`You can't update collection of another user`);
  } else if (ownerId) {
    const user = await client.user.findUnique({
      where: { id: ownerId },
    });
    if (!user)
      throw new BadRequestException(
        `Can't assign collection to non existing user`,
      );
  }

  return await client.collection.findUnique({
    where: { id: collectionId },
    select: {
      ownerId: true,
    },
  });
}
