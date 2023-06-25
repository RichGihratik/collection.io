import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@collection.io/prisma';
import { TUserInfo } from '@collection.io/access-jwt';
import { SearchOptionsDto } from './dto';

@Injectable()
export class CollectionService {
  constructor(private db: DatabaseService) {}

  async getAll(options: SearchOptionsDto) {
    // TODO Make search
    const limitStr = `LIMIT ${options.limit ?? 'ALL'}`;
    const offsetStr = `OFFSET ${options.offset ?? 0}`;
    const collections = this.db.$queryRawUnsafe(``);
  }

  async get(user: TUserInfo, id: number) {
    const collection = await this.db.collection.findUnique({
      where: {
        id,
      },
      select: {
        name: true,
        description: true,
        theme: {
          select: {
            name: true,
          },
        },
        fields: {
          select: {
            fieldType: true,
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            items: true,
          },
        },
      },
    });

    if (!collection) throw new NotFoundException('Collection was not found');

    const fields = collection.fields.map((obj) => obj.fieldType);
    const theme = collection.theme?.name ?? 'Other';
    const itemsCount = collection._count.items;

    const { _avg: rating, _count: votesCount } =
      await this.db.collectionRating.aggregate({
        where: { collectionId: id },
        _avg: {
          rating: true,
        },
        _count: {
          _all: true,
        },
      });

    if (user) {
      collection['viewerRating'] = await this.db.collectionRating.findUnique({
        where: {
          ownerId_collectionId: {
            ownerId: user.id,
            collectionId: id,
          },
        },
      });
    }

    return {
      ...collection,
      theme,
      fields,
      itemsCount,
      rating: rating ?? 0,
      votesCount,
    };
  }
}
