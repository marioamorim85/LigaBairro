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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let ReviewsService = class ReviewsService {
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(reviewerId, requestId, revieweeId, rating, comment) {
        const request = await this.prisma.request.findUnique({
            where: { id: requestId },
            include: {
                applications: {
                    where: { status: 'ACCEPTED' },
                },
            },
        });
        if (!request) {
            throw new common_1.BadRequestException('Pedido não encontrado');
        }
        if (request.status !== 'DONE') {
            throw new common_1.BadRequestException('Apenas pedidos concluídos podem ser avaliados');
        }
        const isRequester = request.requesterId === reviewerId;
        const acceptedApplication = request.applications[0];
        const isAcceptedHelper = (acceptedApplication === null || acceptedApplication === void 0 ? void 0 : acceptedApplication.helperId) === reviewerId;
        if (!isRequester && !isAcceptedHelper) {
            throw new common_1.BadRequestException('Não tem permissão para avaliar este pedido');
        }
        const existingReview = await this.prisma.review.findFirst({
            where: {
                requestId,
                reviewerId,
                revieweeId,
            },
        });
        if (existingReview) {
            throw new common_1.BadRequestException('Já avaliou este utilizador para este pedido');
        }
        const review = await this.prisma.review.create({
            data: {
                requestId,
                reviewerId,
                revieweeId,
                rating,
                comment,
            },
            include: {
                reviewer: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    },
                },
                reviewee: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    },
                },
            },
        });
        await this.updateUserRating(revieweeId);
        await this.notificationsService.notifyNewReview(revieweeId, review.reviewer.name, rating, request.title, request.id);
        return review;
    }
    async findByUser(userId, limit = 10) {
        return this.prisma.review.findMany({
            where: { revieweeId: userId },
            include: {
                reviewer: {
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
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
    async getUserStats(userId) {
        const reviews = await this.prisma.review.findMany({
            where: { revieweeId: userId },
        });
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
            : 0;
        const ratingDistribution = {
            rating5: reviews.filter(r => r.rating === 5).length,
            rating4: reviews.filter(r => r.rating === 4).length,
            rating3: reviews.filter(r => r.rating === 3).length,
            rating2: reviews.filter(r => r.rating === 2).length,
            rating1: reviews.filter(r => r.rating === 1).length,
        };
        return {
            totalReviews,
            averageRating: Math.round(averageRating * 100) / 100,
            ratingDistribution,
        };
    }
    async canReview(reviewerId, requestId, revieweeId) {
        const request = await this.prisma.request.findUnique({
            where: { id: requestId },
            include: {
                applications: {
                    where: { status: 'ACCEPTED' },
                },
            },
        });
        if (!request || request.status !== 'DONE') {
            return false;
        }
        const isRequester = request.requesterId === reviewerId;
        const acceptedApplication = request.applications[0];
        const isAcceptedHelper = (acceptedApplication === null || acceptedApplication === void 0 ? void 0 : acceptedApplication.helperId) === reviewerId;
        if (!isRequester && !isAcceptedHelper) {
            return false;
        }
        const existingReview = await this.prisma.review.findFirst({
            where: {
                requestId,
                reviewerId,
                revieweeId,
            },
        });
        return !existingReview;
    }
    async updateUserRating(userId) {
        const avgResult = await this.prisma.review.aggregate({
            where: { revieweeId: userId },
            _avg: { rating: true },
            _count: { rating: true },
        });
        const avgRating = avgResult._avg.rating || 0;
        const roundedRating = Math.round(avgRating * 100) / 100;
        await this.prisma.user.update({
            where: { id: userId },
            data: { ratingAvg: roundedRating },
        });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map