export declare class CreateReviewInput {
    requestId: string;
    revieweeId: string;
    rating: number;
    comment?: string;
}
export declare class Review {
    id: string;
    requestId: string;
    reviewerId: string;
    revieweeId: string;
    rating: number;
    comment?: string;
    createdAt: Date;
    reviewer?: any;
    reviewee?: any;
    request?: any;
}
export declare class RatingDistribution {
    rating1: number;
    rating2: number;
    rating3: number;
    rating4: number;
    rating5: number;
}
export declare class UserStats {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: RatingDistribution;
}
