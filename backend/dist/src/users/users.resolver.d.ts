import { UsersService } from './users.service';
import { UpdateUserInput, UpdateUserSkillsInput } from './dto/user.dto';
export declare class UsersResolver {
    private usersService;
    constructor(usersService: UsersService);
    me(user: any): Promise<{
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
    updateProfile(user: any, input: UpdateUserInput): Promise<{
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
    updateUserSkills(user: any, input: UpdateUserSkillsInput): Promise<{
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
