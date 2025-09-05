import { ReportsService } from './reports.service';
import { ReportUserInput, ReportRequestInput } from './dto/report.dto';
export declare class ReportsResolver {
    private reportsService;
    constructor(reportsService: ReportsService);
    reportUser(user: any, input: ReportUserInput): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        requestId: string | null;
        reporterId: string;
        targetUserId: string | null;
        reason: string;
    }>;
    reportRequest(user: any, input: ReportRequestInput): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        requestId: string | null;
        reporterId: string;
        targetUserId: string | null;
        reason: string;
    }>;
    reports(user: any): any[] | Promise<{
        id: string;
        createdAt: Date;
        status: string;
        requestId: string | null;
        reporterId: string;
        targetUserId: string | null;
        reason: string;
    }[]>;
}
