import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { TypedBody, TypedRoute } from '@nestia/core';
import { UserRole } from '@collection.io/prisma';
import {
  AuthGuard,
  Role,
  TUserInfo,
  UserInfo,
  UserInfoInterceptor,
} from '@collection.io/access-jwt';
import { UserDto, UserIdsDto } from './dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private service: UserService) {}

  @TypedRoute.Get()
  @UseInterceptors(UserInfoInterceptor)
  getUsers(@UserInfo() info: TUserInfo): Promise<UserDto[]> {
    return this.service.getUsers(info);
  }

  @TypedRoute.Delete('delete')
  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  deleteUsers(@TypedBody() dto: UserIdsDto): Promise<string> {
    return this.service.deleteUsers(dto.users);
  }

  @TypedRoute.Patch('block')
  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  blockUsers(@TypedBody() dto: UserIdsDto): Promise<string> {
    return this.service.blockUsers(dto.users);
  }

  @TypedRoute.Patch('unblock')
  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  unblockUsers(@TypedBody() dto: UserIdsDto): Promise<string> {
    return this.service.unblockUsers(dto.users);
  }

  @TypedRoute.Patch('promote')
  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  promoteUsers(@TypedBody() dto: UserIdsDto): Promise<string> {
    return this.service.promoteUsers(dto.users);
  }

  @TypedRoute.Patch('downgrade')
  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  downgradeUsers(@TypedBody() dto: UserIdsDto): Promise<string> {
    return this.service.downgradeUsers(dto.users);
  }
}
