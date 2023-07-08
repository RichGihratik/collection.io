import { CollectionTheme, DatabaseService } from '@collection.io/prisma';
import { Injectable } from '@nestjs/common';
import { CreateThemeDto, UpdateThemeDto } from './dto';

@Injectable()
export class ThemeService {
  constructor(private db: DatabaseService) {}

  async getAll(): Promise<CollectionTheme[]> {
    return await this.db.collectionTheme.findMany();
  }

  async create(dto: CreateThemeDto): Promise<CollectionTheme> {
    return await this.db.collectionTheme.create({
      data: {
        name: dto.name,
      },
    });
  }

  async update(name: string, dto: UpdateThemeDto): Promise<CollectionTheme> {
    return await this.db.collectionTheme.update({
      where: {
        name,
      },
      data: dto,
    });
  }

  async delete(name: string): Promise<CollectionTheme> {
    return await this.db.collectionTheme.delete({
      where: {
        name,
      },
    });
  }
}
