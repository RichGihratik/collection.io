import { TUserInfo } from '@collection.io/access-jwt';
import { DatabaseService, UserRole } from '@collection.io/prisma';
import { Injectable, NotFoundException } from '@nestjs/common';

const ITEMS_COUNT = 5;

@Injectable()
export class UserService {
  constructor(private db: DatabaseService) {}

  private isFullInfoAllowed(user: TUserInfo, id?: number) {
    return (
      user?.role === UserRole.ADMIN || (id !== undefined && user?.id === id)
    );
  }

  async getUser(id: number, userParam: TUserInfo) {
    const isAllowed = this.isFullInfoAllowed(userParam, id);

    const user =
      userParam ??
      (await this.db.user.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          lastLogin: true,
          createdAt: true,
          role: true,
          status: true,
          email: isAllowed,
        },
      }));

    if (!user) throw new NotFoundException('User was not found');

    // Prisma still doesn't support avg function and relation fields in Group by
    // TODO: Create prisma extension
    const collections = await this.db.$queryRaw`
        SELECT 
          C.id, 
          C.name, 
          C.theme, 
          C.description, 
          COUNT(R.rating) as votesCount, 
          AVG(R.rating) as rating, 
          COUNT(I.id) as itemCount
        FROM Collection as C 
          JOIN Item as I ON I.collectionId = C.id
          JOIN CollectionRating as R ON R.collectionId = C.id 
        WHERE C.ownerId = ${id}
        GROUP BY C.id
        ORDER BY itemCount DESC, rating DESC
        LIMIT ${ITEMS_COUNT}
    `;

    console.log(collections);

    return { user, collections };
  }

  async getUsers(user: TUserInfo) {
    const isAllowed = this.isFullInfoAllowed(user);
    return await this.db.user.findMany({
      select: {
        id: true,
        name: true,
        lastLogin: true,
        createdAt: true,
        role: true,
        status: true,
        email: isAllowed,
        _count: {
          select: {
            collections: true,
          },
        },
      },
    });
  }
}
