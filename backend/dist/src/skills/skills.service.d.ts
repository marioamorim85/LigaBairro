import { PrismaService } from '../common/prisma/prisma.service';
export declare class SkillsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
    }[]>;
    findById(id: string): Promise<{
        id: string;
        name: string;
    }>;
}
