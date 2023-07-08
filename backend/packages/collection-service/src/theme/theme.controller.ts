import { Controller, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { AuthGuard, Role } from '@collection.io/access-jwt';
import { CollectionTheme, UserRole } from '@collection.io/prisma';
import { CreateThemeDto, UpdateThemeDto } from './dto';
import { ThemeService } from './theme.service';

@Controller('theme')
export class ThemeController {
  constructor(private service: ThemeService) {}

  @TypedRoute.Get()
  getAll(): Promise<CollectionTheme[]> {
    return this.service.getAll();
  }

  @TypedRoute.Post()
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

  @TypedRoute.Patch(':name')
  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  async update(
    /**
     * @maxLength 30
     */
    @TypedParam('name')
    name: string,
    @TypedBody()
    dto: UpdateThemeDto,
  ) {
    await this.service.update(name, dto);
    return 'Updated successfully';
  }

  @TypedRoute.Delete(':name')
  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  async delete(
    /**
     * @maxLength 30
     */
    @TypedParam('name')
    name: string,
  ) {
    await this.service.delete(name);
    return 'Deleted successfully';
  }
}
