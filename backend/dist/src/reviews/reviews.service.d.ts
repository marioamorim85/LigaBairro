import { PrismaService } from '../common/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class ReviewsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(reviewerId: string, requestId: string, revieweeId: string, rating: number, comment?: string): Promise<{
        reviewer: {
            id: string;
            name: string;
            avatarUrl: string;
        };
        reviewee: {
            id: string;
            name: string;
            avatarUrl: string;
        };
    } & {
        id: string;
        createdAt: Date;
        rating: number;
        comment: string | null;
        requestId: string;
        reviewerId: string;
        revieweeId: string;
    }>;
    findByUser(userId: string, limit?: number): Promise<({
        request: {
            id: string;
            title: string;
        };
        reviewer: {
            id: string;
            name: string;
            avatarUrl: string;
        };
    } & {
        id: string;
        createdAt: Date;
        rating: number;
        comment: string | null;
        requestId: string;
        reviewerId: string;
        revieweeId: string;
    })[]>;
    getUserStats(userId: string): Promise<{
        totalReviews: number;
        averageRating: number;
        ratingDistribution: {
            rating5: number;
            rating4: number;
            rating3: number;
            rating2: number;
            rating1: number;
        };
    }>;
    canReview(reviewerId: string, requestId: string, revieweeId: string): Promise<boolean>;
    private updateUserRating;
}
