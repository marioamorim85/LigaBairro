import { Field, InputType, ObjectType, ID, Float } from '@nestjs/graphql';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsNumber,
  MinLength,
  MaxLength,
  IsLatitude,
  IsLongitude,
  IsUrl,
  IsArray,
} from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  @MaxLength(50, { message: 'Nome deve ter no máximo 50 caracteres' })
  name: string;

  @Field()
  @IsEmail({}, { message: 'Email deve ser válido' })
  email: string;

  @Field()
  @IsString()
  googleId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'URL do avatar deve ser uma string' })
  @IsUrl({}, { message: 'URL do avatar deve ser válida' })
  avatarUrl?: string;

  @Field()
  @IsString({ message: 'Cidade deve ser uma string' })
  city: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  lng?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Bio deve ser uma string' })
  @MaxLength(200, { message: 'Bio deve ter no máximo 200 caracteres' })
  bio?: string;
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bio?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'Latitude deve ser um número' })
  @IsLatitude({ message: 'Latitude deve ser válida' })
  lat?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'Longitude deve ser um número' })
  @IsLongitude({ message: 'Longitude deve ser válida' })
  lng?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  googleId?: string;
}

@InputType()
export class UpdateUserSkillsInput {
  @Field(() => [ID])
  @IsArray({ message: 'Skills deve ser um array' })
  skillIds: string[];
}

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  googleId: string;

  @Field({ nullable: true })
  avatarUrl?: string;

  @Field()
  city: string;

  @Field(() => Float, { nullable: true })
  lat?: number;

  @Field(() => Float, { nullable: true })
  lng?: number;

  @Field({ nullable: true })
  bio?: string;

  @Field()
  role: string;

  @Field(() => Float, { nullable: true })
  ratingAvg?: number;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [UserSkill], { nullable: true })
  skills?: UserSkill[];
}

@ObjectType()
export class Skill {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;
}

@ObjectType()
export class UserSkill {
  @Field()
  userId: string;

  @Field()
  skillId: string;

  @Field()
  skill: Skill;
}