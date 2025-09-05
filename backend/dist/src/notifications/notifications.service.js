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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
let NotificationsService = class NotificationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const notification = await this.prisma.notification.create({
            data: {
                userId: data.userId,
                type: data.type,
                title: data.title,
                message: data.message,
                data: data.data || null,
            },
        });
        this.sendEmailIfEnabled(data.userId, data.title, data.message);
        return notification;
    }
    async findByUserId(userId, limit = 50, offset = 0) {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        });
    }
    async markAsRead(id, userId) {
        return this.prisma.notification.update({
            where: {
                id,
                userId
            },
            data: { read: true },
        });
    }
    async markAllAsRead(userId) {
        return this.prisma.notification.updateMany({
            where: {
                userId,
                read: false
            },
            data: { read: true },
        });
    }
    async getUnreadCount(userId) {
        return this.prisma.notification.count({
            where: {
                userId,
                read: false,
            },
        });
    }
    async sendEmailIfEnabled(userId, title, message) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { emailNotifications: true, email: true, name: true },
        });
        if (user === null || user === void 0 ? void 0 : user.emailNotifications) {
            console.log(`📧 Email notification to ${user.email}: ${title} - ${message}`);
        }
    }
    async notifyNewApplication(requestOwnerId, applicantName, requestTitle, requestId) {
        return this.create({
            userId: requestOwnerId,
            type: 'NEW_APPLICATION',
            title: 'Nova candidatura',
            message: `${applicantName} candidatou-se ao teu pedido "${requestTitle}"`,
            data: { requestId, applicantName },
        });
    }
    async notifyApplicationAccepted(applicantId, requestTitle, requestId) {
        return this.create({
            userId: applicantId,
            type: 'APPLICATION_ACCEPTED',
            title: 'Candidatura aceite',
            message: `A tua candidatura para "${requestTitle}" foi aceite!`,
            data: { requestId },
        });
    }
    async notifyApplicationRejected(applicantId, requestTitle, requestId) {
        return this.create({
            userId: applicantId,
            type: 'APPLICATION_REJECTED',
            title: 'Candidatura rejeitada',
            message: `A tua candidatura para "${requestTitle}" foi rejeitada.`,
            data: { requestId },
        });
    }
    async notifyNewMessage(userId, senderName, requestTitle, requestId) {
        return this.create({
            userId,
            type: 'NEW_MESSAGE',
            title: 'Nova mensagem',
            message: `${senderName} enviou uma mensagem em "${requestTitle}"`,
            data: { requestId, senderName },
        });
    }
    async notifyRequestStatusChanged(userId, requestTitle, newStatus, requestId) {
        const statusMap = {
            'IN_PROGRESS': 'em progresso',
            'DONE': 'concluído',
            'CANCELLED': 'cancelado',
        };
        return this.create({
            userId,
            type: 'REQUEST_STATUS_CHANGED',
            title: 'Estado do pedido alterado',
            message: `O pedido "${requestTitle}" está agora ${statusMap[newStatus] || newStatus.toLowerCase()}`,
            data: { requestId, newStatus },
        });
    }
    async notifyNewReview(userId, reviewerName, rating, requestTitle, requestId) {
        return this.create({
            userId,
            type: 'NEW_REVIEW',
            title: 'Nova avaliação',
            message: `${reviewerName} avaliou-te com ${rating} estrela${rating !== 1 ? 's' : ''} em "${requestTitle}"`,
            data: { reviewerName, rating, requestTitle, requestId },
        });
    }
    async notifyApplicationRemoved(requestOwnerId, applicantName, requestTitle, requestId) {
        return this.create({
            userId: requestOwnerId,
            type: 'NEW_APPLICATION',
            title: 'Candidatura removida',
            message: `${applicantName} removeu a candidatura ao pedido "${requestTitle}"`,
            data: { requestId, applicantName },
        });
    }
    async notifyOtherApplicants(applicantIds, newApplicantName, requestTitle, requestId) {
        return Promise.all(applicantIds.map(applicantId => this.create({
            userId: applicantId,
            type: 'NEW_APPLICATION',
            title: 'Nova candidatura',
            message: `${newApplicantName} candidatou-se também ao pedido "${requestTitle}"`,
            data: { requestId, applicantName: newApplicantName },
        })));
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map