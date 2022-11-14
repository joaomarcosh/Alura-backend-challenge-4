import { Controller, Request, Post, UseGuards, Response, HttpCode } from '@nestjs/common';
import { LocalAuthGuard } from './local/local-auth.guard';
import { AuthService } from './auth.service';
import { FastifyReply } from 'fastify';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @UseGuards(LocalAuthGuard)
  @HttpCode(204)
  @Post('login')
  async login(@Request() req, @Response({ passthrough: true }) res: FastifyReply) {
    const { access_token } = await this.authService.login(req.user);
    res.setCookie('token', access_token, { path: '/' });
  }
}

