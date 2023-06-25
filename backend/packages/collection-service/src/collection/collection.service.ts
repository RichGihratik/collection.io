import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService, UserRole } from '@collection.io/prisma';
import { TUserInfo } from '@collection.io/access-jwt';
import { sanitize } from 'isomorphic-dompurify';
import {
  CreateCollectionDto,
  DeleteCollectionDto,
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

  private async checkPermissions(
    client: Parameters<Parameters<typeof this.db.$transaction>[0]>[0],
    info: TUserInfo,
    collectionId: number,
    id?: number | null,
  ) {
    if (!info)
      throw new InternalServerErrorException(
        'CRUD method call without authorization',
      );
    if (id && info.id !== id && info.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        `You can't update collection of another user`,
      );
    } else {
      const user = await client.user.findUnique({
        where: { id: collectionId },
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

  private sanitizeDto(dto: CreateCollectionDto | UpdateCollectionDto) {
    if (dto.name) dto.name = sanitize(dto.name);
    if (dto.description) dto.description = sanitize(dto.description);
  }

  async create(info: TUserInfo, dto: CreateCollectionDto) {
    return await this.db.$transaction(async (dbx) => {
      const collection = await this.checkPermissions(
        dbx,
        info,
        dto.id,
        info.id,
      );

      if (collection)
        throw new BadRequestException('Collection already exists!');

      this.sanitizeDto(dto);

      return await dbx.collection.create({
        data: {
          ...dto,
          fields: {
            createMany: {
              data: dto.fields.map((field) => ({
                fieldType: field.type,
                name: field.name,
                collection: { connect: { id: dto.id } },
              })),
            },
          },
        },
      });
    });
  }

  async update(info: TUserInfo, dto: UpdateCollectionDto) {
    return await this.db.$transaction(async (dbx) => {
      const collection = await this.checkPermissions(
        dbx,
        info,
        dto.id,
        info.id,
      );

      if (!collection) throw new NotFoundException('Collection was not found!');

      if (info.role !== UserRole.ADMIN && collection.ownerId !== info.id)
        throw new ForbiddenException(`Can't update another user's collection!`);

      this.sanitizeDto(dto);

      const newData: Omit<UpdateCollectionDto, 'id'> = {};

      for (const [key, value] of Object.entries(dto)) {
        if (key === 'id') continue;
        if (value !== undefined)
          newData[key] = value === null ? undefined : value;
      }

      // TODO Create update for columns

      return await dbx.collection.update({
        where: { id: dto.id },
        data: {
          ...newData,
        },
      });
    });
  }

  async delete(info: TUserInfo, dto: DeleteCollectionDto) {
    return await this.db.$transaction(async (dbx) => {
      const collection = await this.checkPermissions(
        dbx,
        info,
        dto.id,
        info.id,
      );

      if (!collection) throw new NotFoundException('Collection was not found!');

      if (info.role !== UserRole.ADMIN && collection.ownerId !== info.id)
        throw new ForbiddenException(`Can't delete another user's collection!`);

      return await dbx.collection.delete({ where: { id: dto.id } });
    });
  }
}
