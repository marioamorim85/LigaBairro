import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private logger;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinRequest(client: Socket, data: {
        requestId: string;
    }): void;
    handleLeaveRequest(client: Socket, data: {
        requestId: string;
    }): void;
    emitNewApplication(requestId: string, application: any): void;
    emitRequestStatusChange(requestId: string, status: string): void;
    emitApplicationAccepted(applicationId: string, application: any): void;
    emitApplicationStatusToUser(userId: string, applicationData: any): void;
    emitApplicationRemoved(applicationId: string, result: any): void;
    emitUserNotification(userId: string, notification: any): void;
    handleJoinUser(client: Socket, data: {
        userId: string;
    }): void;
    handleLeaveUser(client: Socket, data: {
        userId: string;
    }): void;
}
