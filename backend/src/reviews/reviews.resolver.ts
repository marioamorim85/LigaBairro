import { Resolver, Mutation, Query, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ReviewsService } from './reviews.service';
import { CreateReviewInput, Review, UserStats } from './dto/review.dto';

@Resolver()
export class ReviewsResolver {
  constructor(private reviewsService: ReviewsService) {}

  @Mutation(() => Review)
  @UseGuards(GqlAuthGuard)
  createReview(
    @CurrentUser() user: any,
    @Args('input') input: CreateReviewInput,
  ) {
    return this.reviewsService.create(
      user.id,
      input.requestId,
      input.revieweeId,
      input.rating,
      input.comment,
    );
  }

  @Query(() => [Review])
  @UseGuards(GqlAuthGuard)
  userReviews(
    @Args('userId') userId: string,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ) {
    return this.reviewsService.findByUser(userId, limit);
  }

  @Query(() => UserStats)
  @UseGuards(GqlAuthGuard)
  userStats(@Args('userId') userId: string) {
    return this.reviewsService.getUserStats(userId);
  }

  @Query(() => Boolean)
  @UseGuards(GqlAuthGuard)
  canReview(
    @CurrentUser() user: any,
    @Args('requestId') requestId: string,
    @Args('revieweeId') revieweeId: string,
  ) {
    return this.reviewsService.canReview(user.id, requestId, revieweeId);
  }
}