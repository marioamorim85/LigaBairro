import { User } from '../../users/dto/user.dto';
export declare class SendMessageInput {
    requestId: string;
    text: string;
}
export declare class Message {
    id: string;
    requestId: string;
    senderId: string;
    text: string;
    createdAt: Date;
    sender?: User;
}
