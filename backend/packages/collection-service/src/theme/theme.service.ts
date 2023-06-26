import { CollectionTheme, DatabaseService } from '@collection.io/prisma';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateThemeDto, UpdateThemeDto, DeleteThemeDto } from './dto';

@Injectable()
export class ThemeService {
  constructor(private db: DatabaseService) {}

  async getAll(): Promise<CollectionTheme[]> {
    return await this.db.collectionTheme.findMany();
  }

  async get(id: number): Promise<CollectionTheme> {
    const theme = await this.db.collectionTheme.findUnique({
      where: {
        id,
      },
    });

    if (!theme) throw new NotFoundException('Theme not found!');

    return theme;
  }

  async create(dto: CreateThemeDto): Promise<CollectionTheme> {
    return await this.db.collectionTheme.create({
      data: {
        name: dto.name,
      },
    });
  }

  async update(dto: UpdateThemeDto): Promise<CollectionTheme> {
    return await this.db.collectionTheme.update({
      where: {
        id: dto.id,
      },
      data: {
        name: dto.name,
      },
    });
  }

  async delete(dto: DeleteThemeDto): Promise<CollectionTheme> {
    return await this.db.collectionTheme.delete({
      where: {
        id: dto.id,
      },
    });
  }
}
