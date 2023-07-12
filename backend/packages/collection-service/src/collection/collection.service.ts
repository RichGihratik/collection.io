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

import { sanitizeFields } from './sanitize-fields';
import { checkCollectionPermissions } from './check-permisson';
import { CreateCollectionDto, UpdateCollectionDto } from './dto';

@Injectable()
export class CollectionService {
  constructor(private db: DatabaseService) {}

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
        throw new ForbiddenException({
          message: `Can not create collection to another user`,
          messageCode: 'collection.forbidden',
        });

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
          imageUrl: dto.imageUrl,
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
          imageUrl: dto.imageUrl,
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
