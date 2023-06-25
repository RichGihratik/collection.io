import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import {
  AuthGuard,
  TUserInfo,
  UserInfo,
  UserInfoInterceptor,
} from '@collection.io/access-jwt';
import {
  CreateCollectionDto,
  UpdateCollectionDto,
  DeleteCollectionDto,
  SearchOptionsDto,
} from './dto';
import { CollectionService } from './collection.service';

@Controller('collection')
export class CollectionController {
  constructor(private service: CollectionService) {}

  @TypedRoute.Get('search')
  @UseInterceptors(UserInfoInterceptor)
  getCollections(
    @TypedBody()
    props: SearchOptionsDto,
  ) {
    return this.service.search(props);
  }

  @TypedRoute.Get(':id')
  @UseInterceptors(UserInfoInterceptor)
  getCollection(
    @TypedParam('id')
    id: number,
    @UserInfo()
    info?: TUserInfo,
  ) {
    return this.service.get(id, info);
  }

  @TypedRoute.Post('create')
  @UseGuards(AuthGuard)
  create(
    @TypedBody()
    dto: CreateCollectionDto,
    @UserInfo()
    info: TUserInfo,
  ) {
    return this.service.create(info, dto);
  }

  @TypedRoute.Patch('update')
  @UseGuards(AuthGuard)
  update(
    @TypedBody()
    dto: UpdateCollectionDto,
    @UserInfo()
    info: TUserInfo,
  ) {
    return this.service.update(info, dto);
  }

  @TypedRoute.Delete('delete')
  @UseGuards(AuthGuard)
  delete(
    @TypedBody()
    dto: DeleteCollectionDto,
    @UserInfo()
    info: TUserInfo,
  ) {
    return this.service.delete(info, dto);
  }
}
