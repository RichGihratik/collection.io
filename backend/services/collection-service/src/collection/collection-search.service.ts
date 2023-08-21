import { DatabaseService } from '@collection.io/prisma';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TUserInfo } from '@collection.io/access-auth';
import { Prisma } from '@collection.io/prisma';
import { SearchLang, prepareSearch, OrderByType } from '@/search';

import {
  SearchOptionsDto,
  CollectionFullInfoDto,
  CollectionDto,
  OrderByField,
} from './dto';

@Injectable()
export class CollectionSearchService {
  constructor(private db: DatabaseService) {}

  async search(options: SearchOptionsDto): Promise<CollectionDto[]> {
    let wherePart = options.userId
      ? Prisma.sql`u."id" = ${options.userId}`
      : undefined;

    let orderPart = Prisma.raw(
      `"${options.orderBy ?? OrderByField.ItemCount}" ${
        options.orderType ?? OrderByType.Descending
      }`,
    );

    if (options.searchBy && options.searchBy !== '') {
      const rusSearch = prepareSearch(options.searchBy, SearchLang.Rus);
      const engSearch = prepareSearch(options.searchBy, SearchLang.Eng);

      wherePart = Prisma.sql`
        ${wherePart ? Prisma.sql`(${wherePart}) AND` : Prisma.empty} 
        (c."ts_rus" @@ ${rusSearch} OR
        c."ts_eng" @@ ${engSearch})
      `;

      orderPart = Prisma.sql`
        LEAST(ts_rank(c."ts_rus", ${rusSearch}), ts_rank(c."ts_eng", ${engSearch})) DESC,
        ${orderPart}
      `;
    }

    const collections = await this.db.$queryRaw<CollectionDto[]>`
      SELECT 
        c."id",
        c."name",
        COALESCE(c."themeName", 'Other') AS "theme",
        json_build_object(
          'id', u."id",
          'name', u."name"
        ) AS "owner",
        COUNT(r.rating)::INTEGER AS "votesCount",
        COUNT(i.id)::INTEGER AS "itemsCount",
        COALESCE(AVG(r.rating), 0)::REAL AS "rating"
      FROM "Collection" AS c
        LEFT JOIN "Item" AS i
        ON c.id = i."collectionId"
        LEFT JOIN "CollectionRating" AS r
        ON c.id = r."collectionId"
        JOIN "User" AS u
        ON c."ownerId" = u.id ${
          wherePart ? Prisma.sql`\nWHERE ${wherePart}` : Prisma.empty
        }
      GROUP BY c.id, u.id
      ORDER BY
        ${orderPart}${
          options.limit ? Prisma.sql`\nLIMIT ${options.limit}` : Prisma.empty
        }${
          options.offset ? Prisma.sql`\nOFFSET ${options.offset}` : Prisma.empty
        }`;

    return collections;
  }

  async get(id: number, user?: TUserInfo): Promise<CollectionFullInfoDto> {
    return await this.db.$transaction(async (dbx) => {
      const collection = await dbx.collection.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          description: true,
          themeName: true,
          fields: {
            select: {
              name: true,
              type: true,
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
              ratings: true,
            },
          },
        },
      });

      if (!collection)
        throw new NotFoundException({
          message: 'Collection was not found',
          messageCode: 'collection.notFound',
        });

      const theme = collection.themeName ?? 'Other';
      const itemsCount = collection._count.items;
      const votesCount = collection._count.ratings;

      const {
        _avg: { rating },
      } = await dbx.collectionRating.aggregate({
        where: { collectionId: id },
        _avg: {
          rating: true,
        },
      });

      if (user) {
        const viewerRating = await dbx.collectionRating.findUnique({
          where: {
            ownerId_collectionId: {
              ownerId: user.id,
              collectionId: id,
            },
          },
        });
        if (viewerRating) collection['viewerRating'] = viewerRating;
      }

      return {
        ...collection,
        theme,
        itemsCount,
        rating: rating ?? 0,
        votesCount,
      };
    });
  }
}
