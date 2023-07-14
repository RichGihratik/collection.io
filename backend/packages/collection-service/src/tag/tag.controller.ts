import { DatabaseService } from '@collection.io/prisma';
import { TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';

@Controller('tags')
export class TagController {
  constructor(private db: DatabaseService) {}

  @TypedRoute.Get()
  async getAll(): Promise<string[]> {
    return (await this.db.itemTag.findMany()).map(tag => tag.name); 
  }
}
