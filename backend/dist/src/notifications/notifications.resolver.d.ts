import { NotificationsService } from './notifications.service';
export declare class NotificationsResolver {
    private notificationsService;
    constructor(notificationsService: NotificationsService);
    getUserNotifications(user: any, offset: number, limit: number): Promise<{
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
    unreadNotificationsCount(user: any): Promise<number>;
    markNotificationAsRead(user: any, id: string): Promise<{
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
    markAllNotificationsAsRead(user: any): Promise<boolean>;
}
