import { Controller, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { AuthGuard, TUserInfo, UserInfo } from '@collection.io/access-auth';
import { ItemService } from './item.service';
import { ItemSearchService } from './item-search.service';
import { CreateItemDto, Item, SearchOptionsDto, UpdateItemDto } from './dto';

@Controller('items')
export class ItemController {
  constructor(
    private item: ItemService,
    private search: ItemSearchService,
  ) {}

  @TypedRoute.Get()
  getItems(
    @TypedQuery()
    dto: SearchOptionsDto
  ): Promise<Item[]> {
    return this.search.search(dto);
  }

  @TypedRoute.Get(':id')
  getItem(@TypedParam('id') id: number): Promise<Item> {
    return this.search.get(id);
  }

  @UseGuards(AuthGuard)
  @TypedRoute.Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @TypedBody()
    dto: CreateItemDto,
    @UserInfo()
    info: TUserInfo,
  ): Promise<string> {
    await this.item.create(dto, info);
    return 'Created successfully';
  }

  @UseGuards(AuthGuard)
  @TypedRoute.Patch(':id')
  async update(
    @TypedParam('id')
    id: number,
    @TypedBody()
    dto: UpdateItemDto,
    @UserInfo()
    info: TUserInfo,
  ): Promise<string> {
    await this.item.update(id, dto, info);
    return 'Updated successfully';
  }

  @UseGuards(AuthGuard)
  @TypedRoute.Delete(':id')
  async delete(
    @TypedParam('id')
    id: number,
    @UserInfo()
    info: TUserInfo,
  ): Promise<string> {
    await this.item.delete(id, info);
    return 'Deleted successfully';
  }
}
