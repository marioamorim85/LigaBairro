import { HealthCheckService, PrismaHealthIndicator, MemoryHealthIndicator, DiskHealthIndicator } from '@nestjs/terminus';
import { PrismaService } from '../common/prisma/prisma.service';
export declare class HealthController {
    private health;
    private prisma;
    private memory;
    private disk;
    private prismaService;
    constructor(health: HealthCheckService, prisma: PrismaHealthIndicator, memory: MemoryHealthIndicator, disk: DiskHealthIndicator, prismaService: PrismaService);
    check(): Promise<import("@nestjs/terminus").HealthCheckResult>;
    live(): {
        status: string;
        timestamp: string;
        service: string;
        version: string;
    };
    ready(): Promise<{
        status: string;
        database: string;
        timestamp: string;
        error?: undefined;
    } | {
        status: string;
        database: string;
        error: any;
        timestamp: string;
    }>;
}
