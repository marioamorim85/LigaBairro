import { PrismaService } from '../common/prisma/prisma.service';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    reportUser(reporterId: string, targetUserId: string, reason: string, details?: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        requestId: string | null;
        reporterId: string;
        targetUserId: string | null;
        reason: string;
    }>;
    reportRequest(reporterId: string, requestId: string, reason: string, details?: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        requestId: string | null;
        reporterId: string;
        targetUserId: string | null;
        reason: string;
    }>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        requestId: string | null;
        reporterId: string;
        targetUserId: string | null;
        reason: string;
    }[]>;
}
