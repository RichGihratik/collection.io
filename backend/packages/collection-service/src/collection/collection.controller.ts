import { Controller, UseGuards } from '@nestjs/common';
import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { AuthGuard, TUserInfo, UserInfo } from '@collection.io/access-jwt';

@Controller('collection')
export class CollectionController {
  @TypedRoute.Get()
  getCollections() {
    return [];
  }

  @TypedRoute.Get(':id')
  getCollection(@TypedParam('id') id: number) {
    return { id };
  }

  @TypedRoute.Post('create')
  @UseGuards(AuthGuard)
  create(@TypedBody() dto, @UserInfo() info: TUserInfo) {
    return { dto, info };
  }

  @TypedRoute.Patch('update/:id')
  @UseGuards(AuthGuard)
  update(
    @TypedParam('id') id: number,
    @TypedBody() dto,
    @UserInfo() info: TUserInfo,
  ) {
    return { id, dto, info };
  }

  @TypedRoute.Delete('delete')
  @UseGuards(AuthGuard)
  delete(@TypedBody() dto, @UserInfo() info: TUserInfo) {
    return { dto, info };
  }
}
