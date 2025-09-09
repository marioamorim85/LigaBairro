import { Field, InputType, ObjectType, ID } from '@nestjs/graphql';
import { IsString, MinLength, MaxLength, IsIn, IsOptional } from 'class-validator';

export enum ReportReason {
  SPAM = 'SPAM',
  INAPPROPRIATE = 'INAPPROPRIATE',
  SCAM = 'SCAM',
  HARASSMENT = 'HARASSMENT',
  FAKE_PROFILE = 'FAKE_PROFILE',
  OFFENSIVE_LANGUAGE = 'OFFENSIVE_LANGUAGE',
  FALSE_INFORMATION = 'FALSE_INFORMATION',
  DUPLICATE_POST = 'DUPLICATE_POST',
  PRIVACY_VIOLATION = 'PRIVACY_VIOLATION',
  COPYRIGHT_VIOLATION = 'COPYRIGHT_VIOLATION',
  ILLEGAL_CONTENT = 'ILLEGAL_CONTENT',
  ABUSIVE_PRICING = 'ABUSIVE_PRICING',
  OTHER = 'OTHER',
}

@InputType()
export class ReportUserInput {
  @Field()
  @IsString({ message: 'ID do usuário deve ser uma string' })
  targetUserId: string;

  @Field()
  @IsString({ message: 'Motivo deve ser uma string' })
  @IsIn(Object.values(ReportReason), { message: 'Motivo deve ser válido' })
  reason: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Detalhes deve ser uma string' })
  @MinLength(10, { message: 'Detalhes devem ter pelo menos 10 caracteres' })
  @MaxLength(500, { message: 'Detalhes devem ter no máximo 500 caracteres' })
  details?: string;
}

@InputType()
export class ReportRequestInput {
  @Field()
  @IsString({ message: 'ID do pedido deve ser uma string' })
  requestId: string;

  @Field()
  @IsString({ message: 'Motivo deve ser uma string' })
  @IsIn(Object.values(ReportReason), { message: 'Motivo deve ser válido' })
  reason: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Detalhes deve ser uma string' })
  @MinLength(10, { message: 'Detalhes devem ter pelo menos 10 caracteres' })
  @MaxLength(500, { message: 'Detalhes devem ter no máximo 500 caracteres' })
  details?: string;
}


@ObjectType()
export class Report {
  @Field(() => ID)
  id: string;

  @Field()
  reporterId: string;

  @Field({ nullable: true })
  targetUserId?: string;

  @Field({ nullable: true })
  requestId?: string;

  @Field()
  reason: string;

  @Field({ nullable: true })
  details?: string;

  @Field()
  status: string;

  @Field({ nullable: true })
  adminNotes?: string;

  @Field()
  createdAt: Date;

  // Relations will be resolved by field resolvers
  reporter?: any;
  targetUser?: any;
  request?: any;
}