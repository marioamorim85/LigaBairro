import { ReviewsService } from './reviews.service';
import { CreateReviewInput } from './dto/review.dto';
export declare class ReviewsResolver {
    private reviewsService;
    constructor(reviewsService: ReviewsService);
    createReview(user: any, input: CreateReviewInput): Promise<{
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
    userReviews(userId: string, limit: number): Promise<({
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
    userStats(userId: string): Promise<{
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
    canReview(user: any, requestId: string, revieweeId: string): Promise<boolean>;
}
