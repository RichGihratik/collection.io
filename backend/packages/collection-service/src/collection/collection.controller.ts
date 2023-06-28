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
  SearchOptionsDto,
  UpdateFieldsDto,
} from './dto';
import { CollectionService } from './collection.service';
import { FieldConfigService } from './field-config.service';

@Controller('collection')
export class CollectionController {
  constructor(
    private collection: CollectionService,
    private fieldConfig: FieldConfigService,
  ) {}

  @TypedRoute.Get('search')
  @UseInterceptors(UserInfoInterceptor)
  getCollections(
    @TypedBody()
    props: SearchOptionsDto,
  ) {
    return this.collection.search(props);
  }

  @TypedRoute.Get(':id')
  @UseInterceptors(UserInfoInterceptor)
  getCollection(
    @TypedParam('id')
    id: number,
    @UserInfo()
    info?: TUserInfo,
  ) {
    return this.collection.get(id, info);
  }

  @TypedRoute.Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  async create(
    @TypedBody()
    dto: CreateCollectionDto,
    @UserInfo()
    info: TUserInfo,
  ) {
    await this.collection.create(dto, info);
    return 'Created successfully';
  }

  @TypedRoute.Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @TypedParam('id')
    id: number,
    @TypedBody()
    dto: UpdateCollectionDto,
    @UserInfo()
    info: TUserInfo,
  ) {
    await this.collection.update(id, dto, info);
    return 'Updated successfully';
  }

  @TypedRoute.Delete(':id')
  @UseGuards(AuthGuard)
  async delete(
    @TypedParam('id')
    id: number,
    @UserInfo()
    info: TUserInfo,
  ) {
    await this.collection.delete(id, info);
    return 'Deleted successfully';
  }

  @TypedRoute.Patch(':id/fields')
  @UseGuards(AuthGuard)
  async updateFields(
    @TypedParam('id')
    id: number,
    @TypedBody()
    dto: UpdateFieldsDto,
    @UserInfo()
    info: TUserInfo,
  ) {
    await this.fieldConfig.update(id, dto, info);
    return 'Updated successfully';
  }
}
