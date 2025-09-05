import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
export interface GoogleProfile {
    id: string;
    name: string;
    email: string;
    picture: string;
}
export declare class AuthService {
    private jwtService;
    private configService;
    private usersService;
    constructor(jwtService: JwtService, configService: ConfigService, usersService: UsersService);
    validateGoogleUser(profile: GoogleProfile): Promise<{
        id: string;
        name: string;
        email: string;
        googleId: string;
        avatarUrl: string | null;
        city: string;
        lat: number | null;
        lng: number | null;
        bio: string | null;
        role: import(".prisma/client").$Enums.Role;
        ratingAvg: number | null;
        emailNotifications: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(user: any): Promise<{
        access_token: string;
        user: any;
    }>;
    getCookieOptions(): {
        httpOnly: boolean;
        secure: boolean;
        sameSite: "lax";
        maxAge: number;
        domain: string;
    };
}
