import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { TypedBody, TypedRoute } from '@nestia/core';
import { UserRole } from '@collection.io/prisma';
import { AuthGuard, Role } from '@collection.io/access-jwt';
import { UserIdsDto, AdminActionDto } from './dto';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private admin: AdminService) {}

  @TypedRoute.Delete()
  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  deleteUsers(@TypedBody() dto: UserIdsDto): Promise<string> {
    return this.admin.deleteUsers(dto.users);
  }

  @TypedRoute.Patch()
  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  update(@TypedBody() dto: AdminActionDto): Promise<string> {
    return this.admin.update(dto);
  }
}
