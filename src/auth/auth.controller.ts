import {
  Controller,
  Request,
  Post,
  UseGuards,
  Response,
  HttpCode,
  Body,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './local/local-auth.guard';
import { AuthService } from './auth.service';
import { FastifyReply } from 'fastify';
import { SignupUserDTO } from './dtos/signup-user.dto';
import { LoginUserDTO } from './dtos/login-user.dto';

@ApiTags('Auth Controller')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: LoginUserDTO })
  @UseGuards(LocalAuthGuard)
  @HttpCode(204)
  @Post('login')
  async login(
    @Request() req,
    @Response({ passthrough: true }) res: FastifyReply,
  ) {
    const { access_token } = await this.authService.login(req.user);
    res.setCookie('token', access_token, { path: '/' });
  }

  @Post('signup')
  async signUp(@Body() user: SignupUserDTO) {
    await this.authService.signUp(user);
  }
}
