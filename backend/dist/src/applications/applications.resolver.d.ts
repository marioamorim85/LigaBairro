import { ApplicationsService } from './applications.service';
import { MessagesGateway } from '../messages/messages.gateway';
import { Application, ApplyToRequestInput } from './dto/application.dto';
import { PrismaService } from '../common/prisma/prisma.service';
export declare class ApplicationsResolver {
    private applicationsService;
    private messagesGateway;
    private prismaService;
    constructor(applicationsService: ApplicationsService, messagesGateway: MessagesGateway, prismaService: PrismaService);
    applyToRequest(user: any, input: ApplyToRequestInput): Promise<{
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
    acceptApplication(user: any, applicationId: string): Promise<{
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
    myApplications(user: any): Promise<({
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
    removeApplication(user: any, applicationId: string): Promise<{
        id: string;
        success: boolean;
        message: string;
    }>;
    helper(application: Application): Promise<{
        id: string;
        createdAt: Date;
        city: string;
        lat: number | null;
        lng: number | null;
        updatedAt: Date;
        name: string;
        email: string;
        googleId: string;
        avatarUrl: string | null;
        bio: string | null;
        role: import(".prisma/client").$Enums.Role;
        ratingAvg: number | null;
        emailNotifications: boolean;
    }>;
    request(application: Application): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.RequestStatus;
        createdAt: Date;
        requesterId: string;
        title: string;
        description: string;
        category: string;
        imageUrls: string[];
        isPaid: boolean;
        budgetCents: number | null;
        scheduledFrom: Date | null;
        scheduledTo: Date | null;
        city: string;
        lat: number;
        lng: number;
        updatedAt: Date;
    }>;
}
