import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

export interface GoogleProfile {
  id: string;
  name: string;
  email: string;
  picture: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  async validateGoogleUser(profile: GoogleProfile) {
    const existingUser = await this.usersService.findByGoogleId(profile.id);

    if (existingUser) {
      if (!existingUser.isActive) {
        return { error: 'BLOCKED_BY_ADMIN', message: 'A sua conta foi bloqueada por um administrador.' };
      }
      // Update user info if needed
      return this.usersService.update(existingUser.id, {
        name: profile.name,
        avatarUrl: profile.picture,
      });
    }

    // Create new user
    return this.usersService.create({
      name: profile.name,
      email: profile.email,
      googleId: profile.id,
      avatarUrl: profile.picture,
      city: 'Fiães', // Fixed for MVP
    });
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  getCookieOptions() {
    return {
      httpOnly: true,
      secure: this.configService.get<string>('COOKIE_SECURE') === 'true',
      sameSite: 'lax' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      domain: this.configService.get<string>('COOKIE_DOMAIN'),
    };
  }
}