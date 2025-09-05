import { PrismaService } from '../common/prisma/prisma.service';
import { NotificationType } from '@prisma/client';
export interface CreateNotificationData {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: any;
}
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateNotificationData): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        read: boolean;
        emailSent: boolean;
        createdAt: Date;
        userId: string;
    }>;
    findByUserId(userId: string, limit?: number, offset?: number): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        read: boolean;
        emailSent: boolean;
        createdAt: Date;
        userId: string;
    }[]>;
    markAsRead(id: string, userId: string): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        read: boolean;
        emailSent: boolean;
        createdAt: Date;
        userId: string;
    }>;
    markAllAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getUnreadCount(userId: string): Promise<number>;
    private sendEmailIfEnabled;
    notifyNewApplication(requestOwnerId: string, applicantName: string, requestTitle: string, requestId: string): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        read: boolean;
        emailSent: boolean;
        createdAt: Date;
        userId: string;
    }>;
    notifyApplicationAccepted(applicantId: string, requestTitle: string, requestId: string): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        read: boolean;
        emailSent: boolean;
        createdAt: Date;
        userId: string;
    }>;
    notifyApplicationRejected(applicantId: string, requestTitle: string, requestId: string): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        read: boolean;
        emailSent: boolean;
        createdAt: Date;
        userId: string;
    }>;
    notifyNewMessage(userId: string, senderName: string, requestTitle: string, requestId: string): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        read: boolean;
        emailSent: boolean;
        createdAt: Date;
        userId: string;
    }>;
    notifyRequestStatusChanged(userId: string, requestTitle: string, newStatus: string, requestId: string): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        read: boolean;
        emailSent: boolean;
        createdAt: Date;
        userId: string;
    }>;
    notifyNewReview(userId: string, reviewerName: string, rating: number, requestTitle: string, requestId: string): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        read: boolean;
        emailSent: boolean;
        createdAt: Date;
        userId: string;
    }>;
    notifyApplicationRemoved(requestOwnerId: string, applicantName: string, requestTitle: string, requestId: string): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        read: boolean;
        emailSent: boolean;
        createdAt: Date;
        userId: string;
    }>;
    notifyOtherApplicants(applicantIds: string[], newApplicantName: string, requestTitle: string, requestId: string): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        read: boolean;
        emailSent: boolean;
        createdAt: Date;
        userId: string;
    }[]>;
}
