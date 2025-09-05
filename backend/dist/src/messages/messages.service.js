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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let MessagesService = class MessagesService {
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async send(userId, input) {
        const request = await this.prisma.request.findUnique({
            where: { id: input.requestId },
            include: {
                applications: {
                    where: {
                        OR: [
                            { status: 'ACCEPTED', helperId: userId },
                            { status: 'APPLIED', helperId: userId },
                        ],
                    },
                },
            },
        });
        if (!request) {
            throw new common_1.BadRequestException('Pedido não encontrado');
        }
        const isRequester = request.requesterId === userId;
        const isAcceptedHelper = request.applications.some(app => app.status === 'ACCEPTED');
        const hasApplied = request.applications.some(app => app.helperId === userId);
        const isOpenRequest = request.status === 'OPEN';
        if (!isRequester && !isAcceptedHelper && !hasApplied && !isOpenRequest) {
            throw new common_1.BadRequestException('Não tem permissão para enviar mensagens neste pedido');
        }
        const message = await this.prisma.message.create({
            data: {
                requestId: input.requestId,
                senderId: userId,
                text: input.text,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    },
                },
            },
        });
        const participantIds = new Set();
        if (request.requesterId !== userId) {
            participantIds.add(request.requesterId);
        }
        const acceptedHelper = request.applications.find(app => app.status === 'ACCEPTED');
        if (acceptedHelper && acceptedHelper.helperId !== userId) {
            participantIds.add(acceptedHelper.helperId);
        }
        request.applications.forEach(app => {
            if (app.helperId !== userId) {
                participantIds.add(app.helperId);
            }
        });
        const previousMessageSenders = await this.prisma.message.findMany({
            where: { requestId: input.requestId },
            select: { senderId: true },
            distinct: ['senderId'],
        });
        previousMessageSenders.forEach(msg => {
            if (msg.senderId !== userId) {
                participantIds.add(msg.senderId);
            }
        });
        await Promise.all(Array.from(participantIds).map(participantId => this.notificationsService.notifyNewMessage(participantId, message.sender.name, request.title, request.id)));
        return message;
    }
    async findByRequest(requestId, userId) {
        const request = await this.prisma.request.findUnique({
            where: { id: requestId },
            include: {
                applications: {
                    where: {
                        OR: [
                            { status: 'ACCEPTED', helperId: userId },
                            { status: 'APPLIED', helperId: userId },
                        ],
                    },
                },
            },
        });
        if (!request) {
            throw new common_1.BadRequestException('Pedido não encontrado');
        }
        const isRequester = request.requesterId === userId;
        const isAcceptedHelper = request.applications.some(app => app.status === 'ACCEPTED');
        const hasApplied = request.applications.some(app => app.helperId === userId);
        const isOpenRequest = request.status === 'OPEN';
        if (!isRequester && !isAcceptedHelper && !hasApplied && !isOpenRequest) {
            throw new common_1.BadRequestException('Não tem permissão para ver mensagens deste pedido');
        }
        return this.prisma.message.findMany({
            where: { requestId },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map