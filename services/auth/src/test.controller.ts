import { Controller, Get, UseGuards } from '@nestjs/common';
import { Role, AuthGuard, UserInfo } from '@collection.io/access-jwt';
import { User } from '@collection.io/prisma';

@Controller('test')
export class TestController {
  @Get('user')
  @Role('CUSTOMER')
  @UseGuards(AuthGuard)
  user(@UserInfo() user: User) {
    console.log(user);
    return 'Only for users';
  }

  @Get('admin')
  @Role('ADMIN')
  @UseGuards(AuthGuard)
  admin() {
    return 'Only for admins';
  }
}
