import { PrismaService } from '../common/prisma/prisma.service';
import { UploadsService } from '../uploads/uploads.service';
import { CreateUserInput, UpdateUserInput } from './dto/user.dto';
export declare class UsersService {
    private prisma;
    private uploadsService;
    constructor(prisma: PrismaService, uploadsService: UploadsService);
    findById(id: string): Promise<{
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
    findByEmail(email: string): Promise<{
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
    findByGoogleId(googleId: string): Promise<{
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
    create(input: CreateUserInput): Promise<{
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
    update(id: string, input: UpdateUserInput): Promise<{
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
    updateUserSkills(userId: string, skillIds: string[]): Promise<{
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
    updateAvatar(userId: string, file: Express.Multer.File): Promise<{
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
