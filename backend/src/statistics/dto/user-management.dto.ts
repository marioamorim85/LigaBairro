import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class UserManagement {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  role: string;

  @Field()
  createdAt: Date;

  @Field()
  totalRequests: number;

  @Field()
  totalApplications: number;

  @Field({ nullable: true })
  averageRating?: number;

  @Field()
  isActive: boolean;
}

@ObjectType()
export class ActivityReport {
  @Field()
  date: string;

  @Field()
  newUsers: number;

  @Field()
  newRequests: number;

  @Field()
  newApplications: number;

  @Field()
  completedRequests: number;

  @Field()
  totalMessages: number;
}