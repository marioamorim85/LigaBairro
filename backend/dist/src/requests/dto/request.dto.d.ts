import { User } from '../../users/dto/user.dto';
import { Application } from '../../applications/dto/application.dto';
import { Message } from '../../messages/dto/message.dto';
export declare enum RequestStatus {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
    CANCELLED = "CANCELLED"
}
export declare class CreateRequestInput {
    title: string;
    description: string;
    category: string;
    isPaid: boolean;
    budgetCents?: number;
    scheduledFrom?: string;
    scheduledTo?: string;
    lat: number;
    lng: number;
    imageUrls?: string[];
}
export declare class UpdateRequestInput {
    title?: string;
    description?: string;
    category?: string;
    isPaid?: boolean;
    budgetCents?: number;
    scheduledFrom?: string;
    scheduledTo?: string;
    imageUrls?: string[];
}
export declare class SearchRequestsInput {
    category?: string;
    status?: RequestStatus;
    limit: number;
    offset: number;
}
export declare class Request {
    id: string;
    requesterId: string;
    title: string;
    description: string;
    category: string;
    isPaid: boolean;
    budgetCents?: number;
    status: RequestStatus;
    scheduledFrom?: Date;
    scheduledTo?: Date;
    city: string;
    lat: number;
    lng: number;
    createdAt: Date;
    updatedAt: Date;
    distance?: number;
    imageUrls: string[];
    requester?: User;
    applications?: Application[];
    messages?: Message[];
}
