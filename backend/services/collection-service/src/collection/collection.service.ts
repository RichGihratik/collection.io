import { Injectable } from '@nestjs/common';
import { Collection, DatabaseService, UserRole } from '@collection.io/prisma';
import { TUserInfo } from '@collection.io/access-auth';
import { sanitize } from 'isomorphic-dompurify';

import { sanitizeFields } from './sanitize-fields';
import { checkCollectionPermissions } from './check-permisson';
import { CreateCollectionDto, RateDto, UpdateCollectionDto } from './dto';
import { CollectionForbidden, CollectionNotFound } from './exceptions';

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
        throw new CollectionForbidden();

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
          name: dto.name,
          description: dto.description,
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

  async rate(id: number, dto: RateDto, user: TUserInfo) {
    const collection = await this.db.collection.findUnique({
      where: { id },
    });

    if (!collection) throw new CollectionNotFound();

    await this.db.collectionRating.upsert({
      where: {
        ownerId_collectionId: {
          collectionId: id,
          ownerId: user.id,
        },
      },
      create: {
        collectionId: id,
        ownerId: user.id,
        rating: dto.rating,
      },
      update: {
        rating: dto.rating,
      },
    });
  }

  async delete(id: number, info: TUserInfo): Promise<Collection> {
    return await this.db.$transaction(async (dbx) => {
      await checkCollectionPermissions(dbx, info, id);
      return await dbx.collection.delete({ where: { id } });
    });
  }
}
