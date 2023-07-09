import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Collection,
  DatabaseService,
  Prisma,
  UserRole,
} from '@collection.io/prisma';
import { TUserInfo } from '@collection.io/access-jwt';
import { sanitize } from 'isomorphic-dompurify';

import { SearchLang, prepareSearch, OrderByType } from '@/search';
import { sanitizeFields } from './sanitize-fields';
import { checkCollectionPermissions } from './check-permisson';
import {
  CreateCollectionDto,
  SearchOptionsDto,
  UpdateCollectionDto,
  CollectionFullInfoDto,
  CollectionDto,
  OrderByField,
} from './dto';

@Injectable()
export class CollectionService {
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
        GREATEST(ts_rank(c."ts_rus", ${rusSearch}), ts_rank(c."ts_eng", ${engSearch})) DESC,
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
    }${options.offset ? Prisma.sql`\nOFFSET ${options.offset}` : Prisma.empty}`;

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

      if (!collection) throw new NotFoundException('Collection was not found');

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
        collection['viewerRating'] = await dbx.collectionRating.findUnique({
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
        itemsCount,
        rating: rating ?? 0,
        votesCount,
      };
    });
  }

  private sanitizeDto(dto: CreateCollectionDto | UpdateCollectionDto) {
    if (dto.name) dto.name = sanitize(dto.name);
    if (dto.description) dto.description = sanitize(dto.description);
  }

  private getOwnerQuery(user: TUserInfo, ownerId?: number) {
    return ownerId !== undefined && user.role === UserRole.ADMIN
      ? ({
          owner: {
            connect: {
              id: ownerId,
            },
          },
        } as const)
      : ({
          owner: {
            connect: {
              id: user.id,
            },
          },
        } as const);
  }

  private getThemeQuery(themeName: string | undefined) {
    return themeName
      ? ({
          theme: {
            connect: { name: themeName },
          },
        } as const)
      : undefined;
  }

  async create(dto: CreateCollectionDto, user: TUserInfo): Promise<Collection> {
    return await this.db.$transaction(async (dbx) => {
      if (user.role !== UserRole.ADMIN && user.id !== dto.ownerId)
        throw new ForbiddenException(
          `Can not create collection to another user`,
        );

      this.sanitizeDto(dto);

      let themeName: string | undefined = undefined;

      if (dto.themeName) {
        const theme = await dbx.collectionTheme.findUnique({
          where: { name: dto.themeName },
        });

        themeName = theme?.name;
      }

      return await dbx.collection.create({
        data: {
          name: dto.name,
          description: dto.description,
          ...this.getThemeQuery(themeName),
          ...this.getOwnerQuery(user, dto.ownerId),
          fields: {
            createMany: {
              data: sanitizeFields(dto.fields),
            },
          },
        },
      });
    });
  }

  async update(
    id: number,
    dto: UpdateCollectionDto,
    user: TUserInfo,
  ): Promise<Collection> {
    return await this.db.$transaction(async (dbx) => {
      const collection = await checkCollectionPermissions(
        dbx,
        user,
        id,
        user.id,
      );

      this.sanitizeDto(dto);

      const description = dto.description ?? collection.description;
      const name = dto.name ?? collection.name;

      let themeName: string | undefined = collection.themeName ?? undefined;

      if (dto.themeName) {
        const theme = await dbx.collectionTheme.findUnique({
          where: { name: dto.themeName },
        });

        themeName = theme?.name;
      }

      return await dbx.collection.update({
        where: { id },
        data: {
          name,
          description,
          ...(this.getThemeQuery(themeName) ?? {
            theme: {
              disconnect: true,
            },
          }),
          ...this.getOwnerQuery(user, dto.ownerId),
        },
      });
    });
  }

  async delete(id: number, info: TUserInfo): Promise<Collection> {
    return await this.db.$transaction(async (dbx) => {
      await checkCollectionPermissions(dbx, info, id);
      return await dbx.collection.delete({ where: { id } });
    });
  }
}
