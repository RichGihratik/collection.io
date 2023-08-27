import { Controller, HttpCode, Res, HttpStatus, Req } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { TypedRoute, TypedBody } from '@nestia/core';
import { SigninDto, SignupDto } from './dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @TypedRoute.Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(
    @Res({ passthrough: true }) res: FastifyReply,
    @TypedBody() dto: SigninDto,
  ) {
    return this.authService.signin(res, dto);
  }

  @TypedRoute.Post('signup')
  async signup(
    @Res({ passthrough: true }) res: FastifyReply,
    @TypedBody() dto: SignupDto,
  ) {
    return this.authService.signup(res, dto);
  }

  @TypedRoute.Post('signout')
  @HttpCode(HttpStatus.OK)
  async signout(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    return this.authService.signout(req, res);
  }

  @TypedRoute.Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    return this.authService.refresh(req, res);
  }
}
