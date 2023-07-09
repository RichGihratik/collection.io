import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@collection.io/prisma';
import { TUserInfo } from '@collection.io/access-jwt';
import { checkCollectionPermissions } from './check-permisson';
import { UpdateFieldsDto } from './dto';
import { sanitizeFields } from './sanitize-fields';

@Injectable()
export class FieldConfigService {
  constructor(private db: DatabaseService) {}

  async update(id: number, dto: UpdateFieldsDto, info: TUserInfo) {
    return this.db.$transaction(async (dbx) => {
      const collection = await checkCollectionPermissions(
        dbx,
        info,
        id,
        info.id,
      );

      if (!collection) throw new NotFoundException('Collection was not found!');

      const sanitizedDto = {
        create: sanitizeFields(dto.create).map((field) => ({
          ...field,
          collectionId: id,
        })),
        update: sanitizeFields(dto.update),
        delete: dto.delete.map((item) => item.name),
      };

      await dbx.fieldConfig.createMany({
        data: sanitizedDto.create,
      });

      await dbx.fieldConfig.deleteMany({
        where: {
          collectionId: id,
          name: {
            in: sanitizedDto.delete,
          },
        },
      });
      
      // We cant use batch query here because we change every value to individual values 
      for (const field of sanitizedDto.update)
        await dbx.fieldConfig.update({
          where: {
            name_collectionId: {
              collectionId: id,
              name: field.name,
            },
          },
          data: {
            type: field.type,
          },
        });
    });
  }
}
