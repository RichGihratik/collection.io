import { Controller, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { AuthGuard, Role } from '@collection.io/access-jwt';
import { CollectionTheme, UserRole } from '@collection.io/prisma';
import { CreateThemeDto, UpdateThemeDto, DeleteThemeDto } from './dto';
import { ThemeService } from './theme.service';

@Controller('theme')
export class ThemeController {
  constructor(private service: ThemeService) {}

  @TypedRoute.Get()
  getAll(): Promise<CollectionTheme[]> {
    return this.service.getAll();
  }

  @TypedRoute.Get(':id')
  getTheme(
    @TypedParam('id')
    id: number,
  ): Promise<CollectionTheme> {
    return this.service.get(id);
  }

  @TypedRoute.Post('create')
  @HttpCode(HttpStatus.CREATED)
  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  async create(
    @TypedBody()
    dto: CreateThemeDto,
  ) {
    await this.service.create(dto);
    return 'Created successfully';
  }

  @TypedRoute.Patch('update')
  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  async update(
    @TypedBody()
    dto: UpdateThemeDto,
  ) {
    await this.service.update(dto);
    return 'Updated successfully';
  }

  @TypedRoute.Delete('delete')
  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  async delete(
    @TypedBody()
    dto: DeleteThemeDto,
  ) {
    await this.service.delete(dto);
    return 'Deleted successfully';
  }
}
