import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  UserInfoInterceptor,
  TUserInfo,
  UserInfo,
  AuthGuard,
} from '@collection.io/access-jwt';
import { SearchUserDto, UpdateUserDto, UserDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private user: UserService) {}

  @TypedRoute.Get()
  @UseInterceptors(UserInfoInterceptor)
  search(
    @UserInfo()
    info: TUserInfo,
    @TypedQuery()
    dto: SearchUserDto,
  ): Promise<UserDto[]> {
    return this.user.search(dto, info);
  }

  @TypedRoute.Get(':id')
  @UseInterceptors(UserInfoInterceptor)
  get(
    @UserInfo()
    info: TUserInfo,
    @TypedParam('id')
    id: number,
  ): Promise<UserDto> {
    return this.user.get(id, info);
  }

  @TypedRoute.Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @UserInfo()
    info: TUserInfo,
    @TypedParam('id')
    id: number,
    @TypedBody()
    dto: UpdateUserDto,
  ) {
    await this.user.update(id, dto, info); 
    return 'Updated successfully';
  }
}
