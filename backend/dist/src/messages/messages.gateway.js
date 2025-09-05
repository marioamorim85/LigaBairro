"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let MessagesGateway = class MessagesGateway {
    constructor() {
        this.logger = new common_1.Logger('MessagesGateway');
    }
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    handleJoinRequest(client, data) {
        const room = `request:${data.requestId}`;
        client.join(room);
        this.logger.log(`Client ${client.id} joined room ${room}`);
        client.emit('joined:request', { requestId: data.requestId });
    }
    handleLeaveRequest(client, data) {
        const room = `request:${data.requestId}`;
        client.leave(room);
        this.logger.log(`Client ${client.id} left room ${room}`);
        client.emit('left:request', { requestId: data.requestId });
    }
    emitNewApplication(requestId, application) {
        this.server.to(`request:${requestId}`).emit('application:new', application);
        this.logger.log(`New application notification sent for request ${requestId}`);
    }
    emitRequestStatusChange(requestId, status) {
        this.server.to(`request:${requestId}`).emit('request:status', { requestId, status });
        this.logger.log(`Status change notification sent for request ${requestId}: ${status}`);
    }
    emitApplicationAccepted(applicationId, application) {
        this.server.emit('application:accepted', { applicationId, application });
        this.logger.log(`Application accepted notification sent for application ${applicationId}`);
    }
    emitApplicationStatusToUser(userId, applicationData) {
        this.server.to(`user:${userId}`).emit('application:status', applicationData);
        this.logger.log(`Application status notification sent to user ${userId}`);
    }
    emitApplicationRemoved(applicationId, result) {
        this.server.emit('application:removed', { applicationId, result });
        this.logger.log(`Application removed notification sent for application ${applicationId}`);
    }
    emitUserNotification(userId, notification) {
        this.server.to(`user:${userId}`).emit('notification', notification);
        this.logger.log(`User notification sent to ${userId}`);
    }
    handleJoinUser(client, data) {
        const room = `user:${data.userId}`;
        client.join(room);
        this.logger.log(`Client ${client.id} joined user room ${room}`);
        client.emit('joined:user', { userId: data.userId });
    }
    handleLeaveUser(client, data) {
        const room = `user:${data.userId}`;
        client.leave(room);
        this.logger.log(`Client ${client.id} left user room ${room}`);
        client.emit('left:user', { userId: data.userId });
    }
};
exports.MessagesGateway = MessagesGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MessagesGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join:request'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], MessagesGateway.prototype, "handleJoinRequest", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave:request'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], MessagesGateway.prototype, "handleLeaveRequest", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join:user'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], MessagesGateway.prototype, "handleJoinUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave:user'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], MessagesGateway.prototype, "handleLeaveUser", null);
exports.MessagesGateway = MessagesGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true,
        },
    })
], MessagesGateway);
//# sourceMappingURL=messages.gateway.js.map