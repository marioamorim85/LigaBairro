import { Field, InputType, ObjectType, ID } from '@nestjs/graphql';
import { IsString, MinLength, MaxLength } from 'class-validator';
import { User } from '../../users/dto/user.dto';

@InputType()
export class SendMessageInput {
  @Field()
  @IsString({ message: 'ID do pedido deve ser uma string' })
  requestId: string;

  @Field()
  @IsString({ message: 'Texto deve ser uma string' })
  @MinLength(1, { message: 'Mensagem não pode estar vazia' })
  @MaxLength(500, { message: 'Mensagem deve ter no máximo 500 caracteres' })
  text: string;
}

@ObjectType()
export class Message {
  @Field(() => ID)
  id: string;

  @Field()
  requestId: string;

  @Field()
  senderId: string;

  @Field()
  text: string;

  @Field()
  createdAt: Date;

  // Relations
  @Field(() => User, { nullable: true })
  sender?: User;
}