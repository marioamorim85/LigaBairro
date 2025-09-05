import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('MessagesGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join:request')
  handleJoinRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { requestId: string },
  ) {
    const room = `request:${data.requestId}`;
    client.join(room);
    this.logger.log(`Client ${client.id} joined room ${room}`);
    
    client.emit('joined:request', { requestId: data.requestId });
  }

  @SubscribeMessage('leave:request')
  handleLeaveRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { requestId: string },
  ) {
    const room = `request:${data.requestId}`;
    client.leave(room);
    this.logger.log(`Client ${client.id} left room ${room}`);
    
    client.emit('left:request', { requestId: data.requestId });
  }

  // Method to emit new application notifications
  emitNewApplication(requestId: string, application: any) {
    this.server.to(`request:${requestId}`).emit('application:new', application);
    this.logger.log(`New application notification sent for request ${requestId}`);
  }

  // Method to emit request status changes
  emitRequestStatusChange(requestId: string, status: string) {
    this.server.to(`request:${requestId}`).emit('request:status', { requestId, status });
    this.logger.log(`Status change notification sent for request ${requestId}: ${status}`);
  }

  // Method to emit application accepted notifications
  emitApplicationAccepted(applicationId: string, application: any) {
    // Notify all clients about application acceptance (global event)
    this.server.emit('application:accepted', { applicationId, application });
    this.logger.log(`Application accepted notification sent for application ${applicationId}`);
  }

  // Method to emit application status change to specific user
  emitApplicationStatusToUser(userId: string, applicationData: any) {
    this.server.to(`user:${userId}`).emit('application:status', applicationData);
    this.logger.log(`Application status notification sent to user ${userId}`);
  }

  // Method to emit application removed notifications
  emitApplicationRemoved(applicationId: string, result: any) {
    // Notify about application removal
    this.server.emit('application:removed', { applicationId, result });
    this.logger.log(`Application removed notification sent for application ${applicationId}`);
  }

  // Method to emit user notifications
  emitUserNotification(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('notification', notification);
    this.logger.log(`User notification sent to ${userId}`);
  }

  // Method to join user room (for personal notifications)
  @SubscribeMessage('join:user')
  handleJoinUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string },
  ) {
    const room = `user:${data.userId}`;
    client.join(room);
    this.logger.log(`Client ${client.id} joined user room ${room}`);
    
    client.emit('joined:user', { userId: data.userId });
  }

  @SubscribeMessage('leave:user')
  handleLeaveUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string },
  ) {
    const room = `user:${data.userId}`;
    client.leave(room);
    this.logger.log(`Client ${client.id} left user room ${room}`);
    
    client.emit('left:user', { userId: data.userId });
  }
}