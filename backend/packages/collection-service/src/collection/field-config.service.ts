import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@collection.io/prisma';
import { TUserInfo } from '@collection.io/access-jwt';
import { checkPermissions } from './check-permisson';
import { UpdateFieldsDto } from './dto';
import { sanitizeFields } from './sanitize-fields';

@Injectable()
export class FieldConfigService {
  constructor(private db: DatabaseService) {}

  async update(id: number, info: TUserInfo, dto: UpdateFieldsDto) {
    return this.db.$transaction(async (dbx) => {
      const collection = await checkPermissions(dbx, info, id, info.id);

      if (!collection) throw new NotFoundException('Collection was not found!');

      const sanitizedDto = {
        create: sanitizeFields(dto.create).map((field) => ({
          ...field,
          collectionId: id,
        })),
        update: sanitizeFields(dto.update),
        delete: dto.delete.map((item) => item.id),
      };

      await dbx.fieldConfig.createMany({
        data: sanitizedDto.create,
      });

      await dbx.fieldConfig.updateMany({
        data: sanitizedDto.update,
      });

      await dbx.fieldConfig.deleteMany({
        where: {
          id: {
            in: sanitizedDto.delete,
          },
        },
      });
    });
  }
}
