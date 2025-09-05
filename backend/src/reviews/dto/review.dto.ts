import { Field, InputType, ObjectType, ID, Int, Float } from '@nestjs/graphql';
import { IsString, MinLength, MaxLength, IsInt, Min, Max, IsOptional } from 'class-validator';

@InputType()
export class CreateReviewInput {
  @Field()
  @IsString({ message: 'ID do pedido deve ser uma string' })
  requestId: string;

  @Field()
  @IsString({ message: 'ID do avaliado deve ser uma string' })
  revieweeId: string;

  @Field(() => Int)
  @IsInt({ message: 'Avaliação deve ser um número inteiro' })
  @Min(1, { message: 'Avaliação mínima é 1' })
  @Max(5, { message: 'Avaliação máxima é 5' })
  rating: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Comentário deve ser uma string' })
  @MinLength(10, { message: 'Comentário deve ter pelo menos 10 caracteres' })
  @MaxLength(300, { message: 'Comentário deve ter no máximo 300 caracteres' })
  comment?: string;
}

@ObjectType()
export class Review {
  @Field(() => ID)
  id: string;

  @Field()
  requestId: string;

  @Field()
  reviewerId: string;

  @Field()
  revieweeId: string;

  @Field(() => Int)
  rating: number;

  @Field({ nullable: true })
  comment?: string;

  @Field()
  createdAt: Date;

  // Relations
  reviewer?: any;
  reviewee?: any;
  request?: any;
}

@ObjectType()
export class RatingDistribution {
  @Field(() => Int)
  rating1: number;

  @Field(() => Int)
  rating2: number;

  @Field(() => Int)
  rating3: number;

  @Field(() => Int)
  rating4: number;

  @Field(() => Int)
  rating5: number;
}

@ObjectType()
export class UserStats {
  @Field(() => Int)
  totalReviews: number;

  @Field(() => Float)
  averageRating: number;

  @Field(() => RatingDistribution)
  ratingDistribution: RatingDistribution;
}