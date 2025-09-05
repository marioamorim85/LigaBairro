import { PrismaService } from '../common/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { SendMessageInput } from './dto/message.dto';
export declare class MessagesService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    send(userId: string, input: SendMessageInput): Promise<{
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
    }>;
    findByRequest(requestId: string, userId: string): Promise<({
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
    })[]>;
}
