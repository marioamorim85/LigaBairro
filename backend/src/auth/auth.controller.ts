import { Controller, Get, Post, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // Initiates Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any, @Res() res: Response) {
    if (req.user.error === 'BLOCKED_BY_ADMIN') {
      const frontendUrl = this.configService.get<string>('FRONTEND_URL');
      const errorMessage = encodeURIComponent(req.user.message);
      return res.redirect(`${frontendUrl}/auth/login?error=${errorMessage}`);
    }

    const { access_token } = await this.authService.login(req.user);
    
    // Set JWT in httpOnly cookie
    res.cookie('auth-token', access_token, this.authService.getCookieOptions());
    
    // Redirect to frontend
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    res.redirect(`${frontendUrl}/requests`);
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('auth-token', {
      domain: this.configService.get<string>('COOKIE_DOMAIN'),
    });
    res.json({ message: 'Logged out successfully' });
  }
}