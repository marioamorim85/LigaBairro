import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { Message, SendMessageInput } from './dto/message.dto';
import { PrismaService } from '../common/prisma/prisma.service';
export declare class MessagesResolver {
    private messagesService;
    private messagesGateway;
    private prismaService;
    constructor(messagesService: MessagesService, messagesGateway: MessagesGateway, prismaService: PrismaService);
    messagesByRequest(user: any, requestId: string): Promise<({
        sender: {
            id: string;
            name: string;
            avatarUrl: string;
        };
    } & {
        id: string;
        requestId: string;
        senderId: string;
        text: string;
        createdAt: Date;
    })[]>;
    sendMessage(user: any, input: SendMessageInput): Promise<{
        sender: {
            id: string;
            name: string;
            avatarUrl: string;
        };
    } & {
        id: string;
        requestId: string;
        senderId: string;
        text: string;
        createdAt: Date;
    }>;
    sender(message: Message): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        email: string;
        googleId: string;
        avatarUrl: string | null;
        city: string;
        lat: number | null;
        lng: number | null;
        bio: string | null;
        role: import(".prisma/client").$Enums.Role;
        ratingAvg: number | null;
        emailNotifications: boolean;
        updatedAt: Date;
    }>;
}
