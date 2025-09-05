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
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const messages_gateway_1 = require("../messages/messages.gateway");
let ApplicationsService = class ApplicationsService {
    constructor(prisma, notificationsService, messagesGateway) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
        this.messagesGateway = messagesGateway;
    }
    async apply(userId, input) {
        console.log('=== APPLICATIONS SERVICE APPLY ===');
        console.log('User ID:', userId);
        console.log('Input:', JSON.stringify(input, null, 2));
        try {
            const request = await this.prisma.request.findUnique({
                where: { id: input.requestId },
            });
            console.log('Request found:', request ? 'YES' : 'NO');
            console.log('Request details:', request);
            if (!request) {
                console.log('Throwing: Pedido não encontrado');
                throw new common_1.BadRequestException('Pedido não encontrado');
            }
            if (request.status !== 'OPEN') {
                console.log('Throwing: Pedido já não está disponível - Status:', request.status);
                throw new common_1.BadRequestException('Pedido já não está disponível');
            }
            if (request.requesterId === userId) {
                console.log('Throwing: Não pode candidatar-se ao próprio pedido');
                console.log('Request owner ID:', request.requesterId);
                console.log('Applicant ID:', userId);
                throw new common_1.BadRequestException('Não pode candidatar-se ao próprio pedido');
            }
            const existingApplication = await this.prisma.application.findFirst({
                where: {
                    requestId: input.requestId,
                    helperId: userId,
                },
            });
            console.log('Existing application:', existingApplication ? 'YES' : 'NO');
            if (existingApplication) {
                console.log('Throwing: Já se candidatou a este pedido');
                throw new common_1.BadRequestException('Já se candidatou a este pedido');
            }
            console.log('Creating new application...');
            const application = await this.prisma.application.create({
                data: {
                    requestId: input.requestId,
                    helperId: userId,
                    message: input.message,
                },
                include: {
                    helper: {
                        select: {
                            id: true,
                            name: true,
                            avatarUrl: true,
                            ratingAvg: true,
                        },
                    },
                    request: {
                        select: {
                            id: true,
                            title: true,
                            requester: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
            });
            console.log('Application created successfully:', application);
            const existingApplications = await this.prisma.application.findMany({
                where: {
                    requestId: input.requestId,
                    helperId: { not: userId },
                },
                select: {
                    helperId: true,
                },
            });
            const existingApplicantIds = existingApplications.map(app => app.helperId);
            await Promise.all([
                this.notificationsService.notifyNewApplication(request.requesterId, application.helper.name, request.title, request.id),
                existingApplicantIds.length > 0
                    ? this.notificationsService.notifyOtherApplicants(existingApplicantIds, application.helper.name, request.title, request.id)
                    : Promise.resolve(),
            ]);
            return application;
        }
        catch (error) {
            console.error('Error in applications service:', error);
            throw error;
        }
    }
    async accept(applicationId, requesterId) {
        const application = await this.prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                request: true,
            },
        });
        if (!application) {
            throw new common_1.BadRequestException('Candidatura não encontrada');
        }
        if (application.request.requesterId !== requesterId) {
            throw new common_1.BadRequestException('Apenas o autor do pedido pode aceitar candidaturas');
        }
        if (application.request.status !== 'OPEN') {
            throw new common_1.BadRequestException('Pedido já não está disponível');
        }
        const allApplications = await this.prisma.application.findMany({
            where: { requestId: application.requestId },
            include: {
                helper: {
                    select: { id: true, name: true },
                },
            },
        });
        await this.prisma.$transaction([
            this.prisma.application.update({
                where: { id: applicationId },
                data: { status: 'ACCEPTED' },
            }),
            this.prisma.application.updateMany({
                where: {
                    requestId: application.requestId,
                    id: { not: applicationId },
                },
                data: { status: 'REJECTED' },
            }),
            this.prisma.request.update({
                where: { id: application.requestId },
                data: { status: 'IN_PROGRESS' },
            }),
        ]);
        await Promise.all([
            this.notificationsService.notifyApplicationAccepted(application.helperId, application.request.title, application.requestId),
            ...allApplications
                .filter(app => app.id !== applicationId)
                .map(app => this.notificationsService.notifyApplicationRejected(app.helperId, application.request.title, application.requestId)),
        ]);
        const updatedApplication = await this.prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                helper: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    },
                },
                request: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                    },
                },
            },
        });
        if (updatedApplication) {
            this.messagesGateway.emitNewApplication(application.requestId, {
                type: 'accepted',
                application: updatedApplication,
            });
            this.messagesGateway.emitRequestStatusChange(application.requestId, 'IN_PROGRESS');
            allApplications.forEach(app => {
                if (app.id === applicationId) {
                    this.messagesGateway.emitApplicationStatusToUser(app.helperId, {
                        type: 'ACCEPTED',
                        applicationId: app.id,
                        application: updatedApplication,
                        message: 'A tua candidatura foi aceite!'
                    });
                }
                else {
                    this.messagesGateway.emitApplicationStatusToUser(app.helperId, {
                        type: 'REJECTED',
                        applicationId: app.id,
                        application: Object.assign(Object.assign({}, app), { status: 'REJECTED' }),
                        message: 'A tua candidatura foi rejeitada automaticamente porque outra foi aceite.'
                    });
                }
            });
        }
        return this.prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                helper: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    },
                },
                request: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
    }
    async myApplications(userId) {
        return this.prisma.application.findMany({
            where: { helperId: userId },
            include: {
                request: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        category: true,
                        status: true,
                        createdAt: true,
                        requester: {
                            select: {
                                id: true,
                                name: true,
                                avatarUrl: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async removeApplication(applicationId, userId) {
        console.log('=== REMOVE APPLICATION SERVICE ===');
        console.log('Application ID:', applicationId);
        console.log('User ID:', userId);
        try {
            const application = await this.prisma.application.findUnique({
                where: { id: applicationId },
                include: {
                    request: {
                        select: {
                            id: true,
                            title: true,
                            status: true,
                        },
                    },
                },
            });
            console.log('Application found:', application ? 'YES' : 'NO');
            if (!application) {
                console.log('Throwing: Candidatura não encontrada');
                throw new common_1.BadRequestException('Candidatura não encontrada');
            }
            if (application.helperId !== userId) {
                console.log('Throwing: Apenas o candidato pode remover a própria candidatura');
                console.log('Application helper ID:', application.helperId);
                console.log('Current user ID:', userId);
                throw new common_1.BadRequestException('Apenas o candidato pode remover a própria candidatura');
            }
            if (application.status !== 'APPLIED') {
                console.log('Throwing: Não pode remover candidatura com status:', application.status);
                throw new common_1.BadRequestException('Não é possível remover uma candidatura que já foi processada');
            }
            if (application.request.status !== 'OPEN') {
                console.log('Throwing: Pedido já não está aberto - Status:', application.request.status);
                throw new common_1.BadRequestException('Não é possível remover candidatura de um pedido que já não está aberto');
            }
            console.log('Removing application...');
            await this.prisma.application.delete({
                where: { id: applicationId },
            });
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { name: true },
            });
            const request = await this.prisma.request.findUnique({
                where: { id: application.request.id },
                select: { requesterId: true },
            });
            if (user && request) {
                await this.notificationsService.notifyApplicationRemoved(request.requesterId, user.name, application.request.title, application.request.id);
            }
            console.log('Application removed successfully');
            return {
                id: applicationId,
                success: true,
                message: 'Candidatura removida com sucesso',
            };
        }
        catch (error) {
            console.error('Error in remove application service:', error);
            throw error;
        }
    }
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService,
        messages_gateway_1.MessagesGateway])
], ApplicationsService);
//# sourceMappingURL=applications.service.js.map