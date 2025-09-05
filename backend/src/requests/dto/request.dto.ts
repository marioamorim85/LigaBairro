import { Field, InputType, ObjectType, ID, Int, Float } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsDateString,
  IsEnum,
  MinLength,
  MaxLength,
  IsPositive,
  Min,
  Max,
  IsLatitude,
  IsLongitude,
  IsIn,
  IsArray,
} from 'class-validator';
import { User } from '../../users/dto/user.dto';
import { Application } from '../../applications/dto/application.dto';
import { Message } from '../../messages/dto/message.dto';

export enum RequestStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED',
}

@InputType()
export class CreateRequestInput {
  @Field()
  @IsString({ message: 'Título deve ser uma string' })
  @MinLength(5, { message: 'Título deve ter pelo menos 5 caracteres' })
  @MaxLength(100, { message: 'Título deve ter no máximo 100 caracteres' })
  title: string;

  @Field()
  @IsString({ message: 'Descrição deve ser uma string' })
  @MinLength(20, { message: 'Descrição deve ter pelo menos 20 caracteres' })
  @MaxLength(500, { message: 'Descrição deve ter no máximo 500 caracteres' })
  description: string;

  @Field()
  @IsString({ message: 'Categoria deve ser uma string' })
  @IsIn(['Compras', 'Reparações', 'Companhia a idosos', 'Limpezas', 'Jardinagem', 'Outros'], {
    message: 'Categoria deve ser uma das opções válidas'
  })
  category: string;

  @Field({ defaultValue: false })
  @IsBoolean()
  isPaid: boolean;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'Orçamento deve ser um número' })
  @IsPositive({ message: 'Orçamento deve ser positivo' })
  @Min(100, { message: 'Orçamento mínimo é 1€' })
  @Max(10000000, { message: 'Orçamento máximo é 100.000€' })
  budgetCents?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  scheduledFrom?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  scheduledTo?: string;

  @Field(() => Float)
  @IsNumber({}, { message: 'Latitude deve ser um número' })
  @IsLatitude({ message: 'Latitude deve ser válida' })
  lat: number;

  @Field(() => Float)
  @IsNumber({}, { message: 'Longitude deve ser um número' })
  @IsLongitude({ message: 'Longitude deve ser válida' })
  lng: number;

  @Field(() => [String], { defaultValue: [] })
  @IsArray({ message: 'URLs das imagens deve ser um array' })
  @IsOptional()
  imageUrls?: string[];
}

@InputType()
export class UpdateRequestInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Título deve ser uma string' })
  @MinLength(5, { message: 'Título deve ter pelo menos 5 caracteres' })
  @MaxLength(100, { message: 'Título deve ter no máximo 100 caracteres' })
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  @MinLength(20, { message: 'Descrição deve ter pelo menos 20 caracteres' })
  @MaxLength(500, { message: 'Descrição deve ter no máximo 500 caracteres' })
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Categoria deve ser uma string' })
  @IsIn(['Compras', 'Reparações', 'Companhia a idosos', 'Limpezas', 'Jardinagem', 'Outros'], {
    message: 'Categoria deve ser uma das opções válidas'
  })
  category?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'Orçamento deve ser um número' })
  @IsPositive({ message: 'Orçamento deve ser positivo' })
  @Min(100, { message: 'Orçamento mínimo é 1€' })
  @Max(10000000, { message: 'Orçamento máximo é 100.000€' })
  budgetCents?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  scheduledFrom?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  scheduledTo?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray({ message: 'URLs das imagens deve ser um array' })
  imageUrls?: string[];
}

@InputType()
export class SearchRequestsInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  category?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;

  @Field(() => Int, { defaultValue: 10 })
  @IsNumber({}, { message: 'Limite deve ser um número' })
  @Min(1, { message: 'Limite mínimo é 1' })
  @Max(100, { message: 'Limite máximo é 100' })
  limit: number;

  @Field(() => Int, { defaultValue: 0 })
  @IsNumber({}, { message: 'Offset deve ser um número' })
  @Min(0, { message: 'Offset deve ser 0 ou maior' })
  offset: number;
}

@ObjectType()
export class Request {
  @Field(() => ID)
  id: string;

  @Field()
  requesterId: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  category: string;

  @Field()
  isPaid: boolean;

  @Field(() => Int, { nullable: true })
  budgetCents?: number;

  @Field()
  status: RequestStatus;

  @Field({ nullable: true })
  scheduledFrom?: Date;

  @Field({ nullable: true })
  scheduledTo?: Date;

  @Field()
  city: string;

  @Field(() => Float)
  lat: number;

  @Field(() => Float)
  lng: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Float, { nullable: true })
  distance?: number;

  @Field(() => [String])
  imageUrls: string[];

  // Relations - these will be resolved by field resolvers
  @Field(() => User, { nullable: true })
  requester?: User;

  @Field(() => [Application], { nullable: true })
  applications?: Application[];

  @Field(() => [Message], { nullable: true })
  messages?: Message[];
}