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
exports.RequestsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
const geo_service_1 = require("../common/geo/geo.service");
const notifications_service_1 = require("../notifications/notifications.service");
const request_dto_1 = require("./dto/request.dto");
let RequestsService = class RequestsService {
    constructor(prisma, geoService, notificationsService) {
        this.prisma = prisma;
        this.geoService = geoService;
        this.notificationsService = notificationsService;
    }
    async create(userId, input) {
        this.geoService.validateFiaesLocation(input.lat, input.lng, 'Fiães');
        return this.prisma.request.create({
            data: Object.assign(Object.assign({}, input), { city: 'Fiães', requesterId: userId, scheduledFrom: input.scheduledFrom ? new Date(input.scheduledFrom) : null, scheduledTo: input.scheduledTo ? new Date(input.scheduledTo) : null }),
            include: {
                requester: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                        ratingAvg: true,
                    },
                },
            },
        });
    }
    async search(input) {
        const constraints = this.geoService.getOperationalConstraints();
        const where = {
            city: constraints.city,
            AND: [
                {
                    lat: {
                        gte: constraints.centerLat - (constraints.radiusKm / 111.32),
                        lte: constraints.centerLat + (constraints.radiusKm / 111.32),
                    },
                },
                {
                    lng: {
                        gte: constraints.centerLng - (constraints.radiusKm / (111.32 * Math.cos(constraints.centerLat * Math.PI / 180))),
                        lte: constraints.centerLng + (constraints.radiusKm / (111.32 * Math.cos(constraints.centerLat * Math.PI / 180))),
                    },
                },
            ],
        };
        if (input.category) {
            where.category = input.category;
        }
        if (input.status) {
            where.status = input.status;
        }
        else {
            where.status = request_dto_1.RequestStatus.OPEN;
        }
        const requests = await this.prisma.request.findMany({
            where,
            include: {
                requester: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                        ratingAvg: true,
                    },
                },
                applications: {
                    select: {
                        id: true,
                        status: true,
                        helper: {
                            select: {
                                id: true,
                                name: true,
                                avatarUrl: true,
                            },
                        },
                    },
                },
            },
            orderBy: [
                { createdAt: 'desc' },
            ],
            take: input.limit,
            skip: input.offset,
        });
        return requests.map(request => (Object.assign(Object.assign({}, request), { distance: this.geoService.calculateDistance(constraints.centerLat, constraints.centerLng, request.lat, request.lng) }))).sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }
    async findById(id) {
        return this.prisma.request.findUnique({
            where: { id },
            include: {
                requester: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                        ratingAvg: true,
                    },
                },
                applications: {
                    include: {
                        helper: {
                            select: {
                                id: true,
                                name: true,
                                avatarUrl: true,
                                ratingAvg: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
                messages: {
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
                },
            },
        });
    }
    async update(id, input, userId) {
        const request = await this.prisma.request.findUnique({
            where: { id },
        });
        if (!request) {
            throw new common_1.BadRequestException('Pedido não encontrado');
        }
        if (request.requesterId !== userId) {
            throw new common_1.BadRequestException('Apenas o autor do pedido pode alterar este pedido');
        }
        const updateData = Object.assign(Object.assign({}, input), { scheduledFrom: input.scheduledFrom ? new Date(input.scheduledFrom) : undefined, scheduledTo: input.scheduledTo ? new Date(input.scheduledTo) : undefined });
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });
        return this.prisma.request.update({
            where: { id },
            data: updateData,
            include: {
                requester: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                        ratingAvg: true,
                    },
                },
                applications: {
                    include: {
                        helper: {
                            select: {
                                id: true,
                                name: true,
                                avatarUrl: true,
                                ratingAvg: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });
    }
    async updateStatus(id, status, userId) {
        const request = await this.prisma.request.findUnique({
            where: { id },
        });
        if (!request) {
            throw new common_1.BadRequestException('Pedido não encontrado');
        }
        if (request.requesterId !== userId) {
            throw new common_1.BadRequestException('Apenas o autor do pedido pode alterar o estado');
        }
        const updatedRequest = await this.prisma.request.update({
            where: { id },
            data: { status },
            include: {
                requester: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    },
                },
                applications: {
                    where: { status: 'ACCEPTED' },
                    include: {
                        helper: {
                            select: { id: true },
                        },
                    },
                },
            },
        });
        const acceptedHelper = updatedRequest.applications.find(app => app.status === 'ACCEPTED');
        if (acceptedHelper && status !== 'OPEN') {
            await this.notificationsService.notifyRequestStatusChanged(acceptedHelper.helper.id, updatedRequest.title, status, updatedRequest.id);
        }
        return updatedRequest;
    }
};
exports.RequestsService = RequestsService;
exports.RequestsService = RequestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        geo_service_1.GeoService,
        notifications_service_1.NotificationsService])
], RequestsService);
//# sourceMappingURL=requests.service.js.map