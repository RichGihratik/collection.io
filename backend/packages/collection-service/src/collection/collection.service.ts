import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Collection, DatabaseService, UserRole } from '@collection.io/prisma';
import { TUserInfo } from '@collection.io/access-jwt';
import { sanitize } from 'isomorphic-dompurify';
import { sanitizeFields } from './sanitize-fields';
import { checkCollectionPermissions } from './check-permisson';
import {
  CreateCollectionDto,
  SearchOptionsDto,
  UpdateCollectionDto,
} from './dto';

@Injectable()
export class CollectionService {
  constructor(private db: DatabaseService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async search(options: SearchOptionsDto) {
    // TODO Make search
    /*const limitStr = `LIMIT ${options.limit ?? 'ALL'}`;
    const offsetStr = `OFFSET ${options.offset ?? 0}`;
    const collections = this.db.$queryRawUnsafe(``);*/
  }

  async get(id: number, user?: TUserInfo) {
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
          },
        },
      },
    });

    if (!collection) throw new NotFoundException('Collection was not found');

    const fields = collection.fields.map((obj) => obj.type);
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

  private sanitizeDto(dto: CreateCollectionDto | UpdateCollectionDto) {
    if (dto.name) dto.name = sanitize(dto.name);
    if (dto.description) dto.description = sanitize(dto.description);
  }

  async create(dto: CreateCollectionDto, info: TUserInfo): Promise<Collection> {
    return await this.db.$transaction(async (dbx) => {
      if (info.role !== UserRole.ADMIN && info.id !== dto.ownerId)
        throw new ForbiddenException(
          `Can not create collection to another user`,
        );

      this.sanitizeDto(dto);

      return await dbx.collection.create({
        data: {
          ...dto,
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
    info: TUserInfo,
  ): Promise<Collection> {
    return await this.db.$transaction(async (dbx) => {
      await checkCollectionPermissions(dbx, info, id, info.id);

      this.sanitizeDto(dto);

      const newData: Omit<UpdateCollectionDto, 'id'> = {};

      for (const [key, value] of Object.entries(dto)) {
        if (key === 'id') continue;
        if (value !== undefined) newData[key] = value;
      }

      return await dbx.collection.update({
        where: { id },
        data: {
          ...newData,
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
