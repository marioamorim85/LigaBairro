import { PrismaService } from '../common/prisma/prisma.service';
import { GeoService } from '../common/geo/geo.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateRequestInput, UpdateRequestInput, SearchRequestsInput, RequestStatus } from './dto/request.dto';
export declare class RequestsService {
    private prisma;
    private geoService;
    private notificationsService;
    constructor(prisma: PrismaService, geoService: GeoService, notificationsService: NotificationsService);
    create(userId: string, input: CreateRequestInput): Promise<{
        requester: {
            id: string;
            name: string;
            avatarUrl: string;
            ratingAvg: number;
        };
    } & {
        id: string;
        title: string;
        createdAt: Date;
        requesterId: string;
        description: string;
        category: string;
        imageUrls: string[];
        isPaid: boolean;
        budgetCents: number | null;
        status: import(".prisma/client").$Enums.RequestStatus;
        scheduledFrom: Date | null;
        scheduledTo: Date | null;
        city: string;
        lat: number;
        lng: number;
        updatedAt: Date;
    }>;
    search(input: SearchRequestsInput): Promise<{
        distance: number;
        requester: {
            id: string;
            name: string;
            avatarUrl: string;
            ratingAvg: number;
        };
        applications: {
            id: string;
            status: import(".prisma/client").$Enums.ApplicationStatus;
            helper: {
                id: string;
                name: string;
                avatarUrl: string;
            };
        }[];
        id: string;
        title: string;
        createdAt: Date;
        requesterId: string;
        description: string;
        category: string;
        imageUrls: string[];
        isPaid: boolean;
        budgetCents: number | null;
        status: import(".prisma/client").$Enums.RequestStatus;
        scheduledFrom: Date | null;
        scheduledTo: Date | null;
        city: string;
        lat: number;
        lng: number;
        updatedAt: Date;
    }[]>;
    findById(id: string): Promise<{
        requester: {
            id: string;
            name: string;
            avatarUrl: string;
            ratingAvg: number;
        };
        applications: ({
            helper: {
                id: string;
                name: string;
                avatarUrl: string;
                ratingAvg: number;
            };
        } & {
            id: string;
            message: string | null;
            createdAt: Date;
            requestId: string;
            status: import(".prisma/client").$Enums.ApplicationStatus;
            helperId: string;
        })[];
        messages: ({
            sender: {
                id: string;
                name: string;
                avatarUrl: string;
            };
        } & {
            id: string;
            createdAt: Date;
            requestId: string;
            text: string;
            senderId: string;
        })[];
    } & {
        id: string;
        title: string;
        createdAt: Date;
        requesterId: string;
        description: string;
        category: string;
        imageUrls: string[];
        isPaid: boolean;
        budgetCents: number | null;
        status: import(".prisma/client").$Enums.RequestStatus;
        scheduledFrom: Date | null;
        scheduledTo: Date | null;
        city: string;
        lat: number;
        lng: number;
        updatedAt: Date;
    }>;
    update(id: string, input: UpdateRequestInput, userId: string): Promise<{
        requester: {
            id: string;
            name: string;
            avatarUrl: string;
            ratingAvg: number;
        };
        applications: ({
            helper: {
                id: string;
                name: string;
                avatarUrl: string;
                ratingAvg: number;
            };
        } & {
            id: string;
            message: string | null;
            createdAt: Date;
            requestId: string;
            status: import(".prisma/client").$Enums.ApplicationStatus;
            helperId: string;
        })[];
    } & {
        id: string;
        title: string;
        createdAt: Date;
        requesterId: string;
        description: string;
        category: string;
        imageUrls: string[];
        isPaid: boolean;
        budgetCents: number | null;
        status: import(".prisma/client").$Enums.RequestStatus;
        scheduledFrom: Date | null;
        scheduledTo: Date | null;
        city: string;
        lat: number;
        lng: number;
        updatedAt: Date;
    }>;
    updateStatus(id: string, status: RequestStatus, userId: string): Promise<{
        requester: {
            id: string;
            name: string;
            avatarUrl: string;
        };
        applications: ({
            helper: {
                id: string;
            };
        } & {
            id: string;
            message: string | null;
            createdAt: Date;
            requestId: string;
            status: import(".prisma/client").$Enums.ApplicationStatus;
            helperId: string;
        })[];
    } & {
        id: string;
        title: string;
        createdAt: Date;
        requesterId: string;
        description: string;
        category: string;
        imageUrls: string[];
        isPaid: boolean;
        budgetCents: number | null;
        status: import(".prisma/client").$Enums.RequestStatus;
        scheduledFrom: Date | null;
        scheduledTo: Date | null;
        city: string;
        lat: number;
        lng: number;
        updatedAt: Date;
    }>;
}
