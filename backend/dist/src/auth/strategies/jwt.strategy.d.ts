import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private usersService;
    constructor(configService: ConfigService, usersService: UsersService);
    validate(payload: any): Promise<{
        skills: ({
            skill: {
                id: string;
                name: string;
            };
        } & {
            userId: string;
            skillId: string;
        })[];
    } & {
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
}
export {};
