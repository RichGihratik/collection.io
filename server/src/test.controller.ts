import { Controller, Get, UseGuards } from '@nestjs/common';
import { Role, AuthGuard } from './auth';

@Controller('test')
export class TestController {
  @Get('user')
  @Role('CUSTOMER')
  @UseGuards(AuthGuard)
  user() {
    return 'Only for users';
  }

  @Get('admin')
  @Role('ADMIN')
  @UseGuards(AuthGuard)
  admin() {
    return 'Only for admins';
  }
}
