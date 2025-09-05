export declare enum ReportReason {
    SPAM = "SPAM",
    INAPPROPRIATE = "INAPPROPRIATE",
    SCAM = "SCAM",
    HARASSMENT = "HARASSMENT",
    FAKE_PROFILE = "FAKE_PROFILE",
    OTHER = "OTHER"
}
export declare class ReportUserInput {
    targetUserId: string;
    reason: string;
    details?: string;
}
export declare class ReportRequestInput {
    requestId: string;
    reason: string;
    details?: string;
}
export declare class Report {
    id: string;
    reporterId: string;
    targetUserId?: string;
    requestId?: string;
    reason: string;
    details?: string;
    status: string;
    createdAt: Date;
    reporter?: any;
    targetUser?: any;
    request?: any;
}
