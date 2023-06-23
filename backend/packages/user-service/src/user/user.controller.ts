import { Controller, UseInterceptors } from '@nestjs/common';
import { TypedParam, TypedRoute } from '@nestia/core';
import {
  UserInfo,
  TUserInfo,
  UserInfoInterceptor,
} from '@collection.io/access-jwt';
// import { UserIdsDto } from './dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private service: UserService) {}

  @TypedRoute.Get(':id')
  @UseInterceptors(UserInfoInterceptor)
  getUser(@TypedParam('id') id: number, @UserInfo() user: TUserInfo) {
    return this.service.getUser(id, user);
  }

  @TypedRoute.Get()
  @UseInterceptors(UserInfoInterceptor)
  getUsers(@UserInfo() user: TUserInfo) {
    return this.service.getUsers(user);
  }
}
