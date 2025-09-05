import { Field, InputType, ObjectType, ID } from '@nestjs/graphql';
import { IsString, IsOptional, MaxLength } from 'class-validator';
import { User } from '../../users/dto/user.dto';
import { Request } from '../../requests/dto/request.dto';

export enum ApplicationStatus {
  APPLIED = 'APPLIED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

@InputType()
export class ApplyToRequestInput {
  @Field()
  @IsString({ message: 'ID do pedido deve ser uma string' })
  requestId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Mensagem deve ser uma string' })
  @MaxLength(500, { message: 'Mensagem deve ter no máximo 500 caracteres' })
  message?: string;
}

@ObjectType()
export class Application {
  @Field(() => ID)
  id: string;

  @Field()
  requestId: string;

  @Field()
  helperId: string;

  @Field({ nullable: true })
  message?: string;

  @Field()
  status: ApplicationStatus;

  @Field()
  createdAt: Date;

  // Relations
  @Field(() => Request, { nullable: true })
  request?: Request;

  @Field(() => User, { nullable: true })
  helper?: User;
}

@ObjectType()
export class RemoveApplicationResult {
  @Field(() => ID)
  id: string;

  @Field()
  success: boolean;

  @Field()
  message: string;
}