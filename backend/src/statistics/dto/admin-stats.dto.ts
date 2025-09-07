import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class CategoryStats {
  @Field()
  category: string;

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class AdminStats {
  @Field(() => Int)
  totalUsers: number;

  @Field(() => Int)
  totalRequests: number;

  @Field(() => Int)
  activeRequests: number;

  @Field(() => Int)
  completedRequests: number;

  @Field(() => Int)
  totalApplications: number;

  @Field(() => Int)
  totalMessages: number;

  @Field(() => Int)
  pendingReports: number;

  @Field(() => Int)
  todayMessages: number;

  @Field(() => Float)
  averageRating: number;

  @Field(() => [CategoryStats])
  topCategories: CategoryStats[];
}