import {
  Controller,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
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
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  async create(
    @TypedBody()
    dto: CreateCollectionDto,
    @UserInfo()
    info: TUserInfo,
  ) {
    await this.service.create(info, dto);
    return 'Created successfully';
  }

  @TypedRoute.Patch('update')
  @UseGuards(AuthGuard)
  async update(
    @TypedBody()
    dto: UpdateCollectionDto,
    @UserInfo()
    info: TUserInfo,
  ) {
    await this.service.update(info, dto);
    return 'Updated successfully';
  }

  @TypedRoute.Delete('delete')
  @UseGuards(AuthGuard)
  async delete(
    @TypedBody()
    dto: DeleteCollectionDto,
    @UserInfo()
    info: TUserInfo,
  ) {
    await this.service.delete(info, dto);
    return 'Deleted successfully';
  }
}
