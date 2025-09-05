import { PrismaService } from '../common/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { MessagesGateway } from '../messages/messages.gateway';
import { ApplyToRequestInput } from './dto/application.dto';
export declare class ApplicationsService {
    private prisma;
    private notificationsService;
    private messagesGateway;
    constructor(prisma: PrismaService, notificationsService: NotificationsService, messagesGateway: MessagesGateway);
    apply(userId: string, input: ApplyToRequestInput): Promise<{
        request: {
            id: string;
            title: string;
            requester: {
                id: string;
                name: string;
            };
        };
        helper: {
            id: string;
            name: string;
            avatarUrl: string;
            ratingAvg: number;
        };
    } & {
        id: string;
        message: string | null;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        createdAt: Date;
        requestId: string;
        helperId: string;
    }>;
    accept(applicationId: string, requesterId: string): Promise<{
        request: {
            id: string;
            title: string;
        };
        helper: {
            id: string;
            name: string;
            avatarUrl: string;
        };
    } & {
        id: string;
        message: string | null;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        createdAt: Date;
        requestId: string;
        helperId: string;
    }>;
    myApplications(userId: string): Promise<({
        request: {
            id: string;
            status: import(".prisma/client").$Enums.RequestStatus;
            createdAt: Date;
            title: string;
            description: string;
            category: string;
            requester: {
                id: string;
                name: string;
                avatarUrl: string;
            };
        };
    } & {
        id: string;
        message: string | null;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        createdAt: Date;
        requestId: string;
        helperId: string;
    })[]>;
    removeApplication(applicationId: string, userId: string): Promise<{
        id: string;
        success: boolean;
        message: string;
    }>;
}
