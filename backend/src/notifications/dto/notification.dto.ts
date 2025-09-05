import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql';
import { NotificationType } from '@prisma/client';
import { GraphQLJSON } from 'graphql-scalars';

// Register the enum for GraphQL
registerEnumType(NotificationType, {
  name: 'NotificationType',
});

@ObjectType()
export class Notification {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field(() => NotificationType)
  type: NotificationType;

  @Field()
  title: string;

  @Field()
  message: string;

  @Field(() => GraphQLJSON, { nullable: true })
  data?: any;

  @Field()
  read: boolean;

  @Field()
  emailSent: boolean;

  @Field()
  createdAt: Date;
}