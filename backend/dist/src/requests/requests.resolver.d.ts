import { RequestsService } from './requests.service';
import { Request, CreateRequestInput, UpdateRequestInput, SearchRequestsInput, RequestStatus } from './dto/request.dto';
import { PrismaService } from '../common/prisma/prisma.service';
export declare class RequestsResolver {
    private requestsService;
    private prismaService;
    constructor(requestsService: RequestsService, prismaService: PrismaService);
    createRequest(user: any, input: CreateRequestInput): Promise<{
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
    searchRequests(input: SearchRequestsInput): Promise<{
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
    request(id: string): Promise<{
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
    updateRequest(user: any, id: string, input: UpdateRequestInput): Promise<{
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
    updateRequestStatus(user: any, id: string, status: RequestStatus): Promise<{
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
    requester(request: Request): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        city: string;
        lat: number | null;
        lng: number | null;
        updatedAt: Date;
        email: string;
        googleId: string;
        avatarUrl: string | null;
        bio: string | null;
        role: import(".prisma/client").$Enums.Role;
        ratingAvg: number | null;
        emailNotifications: boolean;
    }>;
    applications(request: Request): Promise<({
        helper: {
            id: string;
            createdAt: Date;
            name: string;
            city: string;
            lat: number | null;
            lng: number | null;
            updatedAt: Date;
            email: string;
            googleId: string;
            avatarUrl: string | null;
            bio: string | null;
            role: import(".prisma/client").$Enums.Role;
            ratingAvg: number | null;
            emailNotifications: boolean;
        };
    } & {
        id: string;
        message: string | null;
        createdAt: Date;
        requestId: string;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        helperId: string;
    })[]>;
    messages(request: Request): Promise<({
        sender: {
            id: string;
            createdAt: Date;
            name: string;
            city: string;
            lat: number | null;
            lng: number | null;
            updatedAt: Date;
            email: string;
            googleId: string;
            avatarUrl: string | null;
            bio: string | null;
            role: import(".prisma/client").$Enums.Role;
            ratingAvg: number | null;
            emailNotifications: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        requestId: string;
        text: string;
        senderId: string;
    })[]>;
}
