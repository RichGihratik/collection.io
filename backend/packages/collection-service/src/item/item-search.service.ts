import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService, Prisma } from '@collection.io/prisma';
import { Item, ItemRawValues, OrderByField, SearchOptionsDto } from './dto';
import { OrderByType, SearchLang, prepareSearch } from '@/search';

@Injectable()
export class ItemSearchService {
  constructor(private db: DatabaseService) {}

  async search(dto: SearchOptionsDto): Promise<Item[]> {
    let wherePart: Prisma.Sql | undefined = undefined;

    let orderPart = Prisma.raw(
      `"${dto.orderBy ?? OrderByField.CreatedAt}" ${
        dto.orderType ?? OrderByType.Descending
      }`,
    );

    function connectWhere(sql: Prisma.Sql) {
      wherePart = wherePart
        ? Prisma.sql`${wherePart} AND ${sql}`
        : Prisma.sql`WHERE ${sql}`;
    }

    if (dto.userId) connectWhere(Prisma.sql`u."id" = ${dto.userId}`);
    if (dto.collectionId)
      connectWhere(Prisma.sql`col."id" = ${dto.collectionId}`);

    if (dto.searchBy) {
      const rusSearch = prepareSearch(dto.searchBy, SearchLang.Rus);
      const engSearch = prepareSearch(dto.searchBy, SearchLang.Eng);

      const condition = Prisma.sql`(
        col."ts_eng" @@ ${engSearch} OR
        item."ts_eng" @@ ${engSearch} OR
        com."ts_eng" @@ ${engSearch} OR
        val."ts_eng" @@ ${engSearch}
      )`;

      connectWhere(condition);

      const orderBy = Prisma.sql`
        LEAST(
          ts_rank(col."ts_rus", ${rusSearch}) +
          ts_rank(item."ts_rus", ${rusSearch}) +
          COALESCE(
            SUM(ts_rank(com."ts_rus", ${rusSearch})), 
            0
          ) +
          COALESCE(
            SUM(ts_rank(val."ts_rus", ${rusSearch})) 
              FILTER (WHERE conf."fieldType" = 'richtext' OR conf."fieldType" = 'text'), 
            0
          ),
          ts_rank(col."ts_eng", ${engSearch}) +
          ts_rank(item."ts_eng", ${engSearch}) +
          COALESCE(
            SUM(ts_rank(com."ts_eng", ${engSearch})), 
            0
          ) +
          COALESCE(
            SUM(ts_rank(val."ts_eng", ${engSearch})) 
              FILTER (WHERE conf."fieldType" = 'richtext' OR conf."fieldType" = 'text'), 
            0
          )
        ) DESC
      `;

      orderPart = Prisma.sql`${orderBy}, ${orderPart}`;
    }

    const items = await this.db.$queryRaw<Item[]>`
      SELECT
        item."id" AS "id",
        item."name" AS "name",
        ARRAY_REMOVE(ARRAY_AGG(DISTINCT tag."B"), NULL) AS "tags",
        item."createdAt" AS "createdAt",
        COALESCE(
          JSON_OBJECT_AGG(
            val."fieldName" , 
            JSON_BUILD_OBJECT(
              'type', UPPER(conf."fieldType"::TEXT),
              'value', val."value"
            ) 
          ) FILTER (WHERE conf."fieldType" <> 'richtext')
        , '{}'::json) AS "values",
        JSON_BUILD_OBJECT(
          'id', col."id",
          'name', col."name"
        ) AS "collection",
        JSON_BUILD_OBJECT(
          'id', u."id",
          'name', u."name"
        ) AS "owner",
        COUNT(l."itemId") FILTER (WHERE l."like")::INTEGER AS "likeCount",
        COUNT(l."itemId") FILTER (WHERE NOT l."like")::INTEGER AS "dislikeCount",
        COUNT(com."id")::INTEGER AS "commentsCount"
      FROM "Item" AS item
        LEFT JOIN "ItemLike" AS l
        ON l."itemId" = item."id"
        LEFT JOIN "ItemComment" AS com
        ON com."itemId" = item."id"
        LEFT JOIN "_ItemToItemTag" AS tag
        ON tag."A" = item."id"
        LEFT JOIN "Collection" AS col
        ON col."id" = item."collectionId"
        LEFT JOIN "User" AS u
        ON col."ownerId" = u."id"
        LEFT JOIN "ItemValue" AS val
        ON val."itemId" = item."id"
        LEFT JOIN "FieldConfig" AS conf
        ON conf."name" = val."fieldName" AND conf."collectionId" = col."id"
      ${wherePart ?? Prisma.empty}
      GROUP BY
        item."id", col."id", u."id"
      ORDER BY 
        ${orderPart}${
          dto.limit ? Prisma.sql`\nLIMIT ${dto.limit}` : Prisma.empty
        }${dto.offset ? Prisma.sql`\nOFFSET ${dto.offset}` : Prisma.empty};
    `;

    console.log(items);

    return items;
  }

  async get(id: number): Promise<Item> {
    return this.db.$transaction(async (dbx) => {
      const item = await dbx.item.findUnique({
        where: {
          id,
        },
        select: {
          collection: {
            select: {
              id: true,
              name: true,
              owner: {
                select: {
                  id: true,
                  name: true,
                  avatarUrl: true,
                },
              },
            },
          },
          createdAt: true,
          _count: {
            select: {
              comments: true,
            },
          },
          tags: {
            select: {
              name: true,
            },
          },
          id: true,
          name: true,
          fields: {
            select: {
              value: true,
              fieldName: true,
              config: {
                select: {
                  name: true,
                  type: true,
                },
              },
            },
          },
        },
      });

      if (!item) throw new NotFoundException('Item not found!');

      const likes = await dbx.itemLike.groupBy({
        by: ['like'],
        where: {
          itemId: id,
        },
        orderBy: {
          like: 'asc',
        },
        _count: {
          _all: true,
        },
      });

      const {
        _count: { _all: dislikeCount },
      } = likes[0] ?? { _count: { _all: 0 } };
      const {
        _count: { _all: likeCount },
      } = likes[1] ?? { _count: { _all: 0 } };

      const values: ItemRawValues = item.fields.reduce(
        (acc: ItemRawValues, item) => {
          acc[item.fieldName] = {
            type: item.config.type,
            value: item.value,
          };
          return acc;
        },
        {},
      );

      return {
        ...item,
        owner: {
          ...item.collection.owner,
          avatarUrl: item.collection.owner.avatarUrl ?? undefined,
        },
        tags: item.tags.map((tag) => tag.name),
        commentsCount: item._count.comments,
        likeCount,
        dislikeCount,
        values,
      };
    });
  }
}
