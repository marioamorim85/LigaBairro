import { NotificationType } from '@prisma/client';
export declare class Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: any;
    read: boolean;
    emailSent: boolean;
    createdAt: Date;
}
