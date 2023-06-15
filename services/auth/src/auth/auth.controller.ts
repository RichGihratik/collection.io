import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { SigninDto, SignupDto } from './dto';
import { AuthService } from './auth.service';
import { FastifyReply, FastifyRequest } from 'fastify';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() dto: SigninDto,
  ) {
    return this.authService.signin(res, dto);
  }

  @Post('signup')
  signup(
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() dto: SignupDto,
  ) {
    return this.authService.signup(res, dto);
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK)
  signout(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    return this.authService.signout(req, res);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    return this.authService.refresh(req, res);
  }
}
