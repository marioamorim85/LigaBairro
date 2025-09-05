import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { Message, SendMessageInput } from './dto/message.dto';
import { User } from '../users/dto/user.dto';
import { PrismaService } from '../common/prisma/prisma.service';

@Resolver(() => Message)
export class MessagesResolver {
  constructor(
    private messagesService: MessagesService,
    private messagesGateway: MessagesGateway,
    private prismaService: PrismaService,
  ) {}

  @Query(() => [Message])
  @UseGuards(GqlAuthGuard)
  messagesByRequest(
    @CurrentUser() user: any,
    @Args('requestId') requestId: string,
  ) {
    return this.messagesService.findByRequest(requestId, user.id);
  }

  @Mutation(() => Message)
  @UseGuards(GqlAuthGuard)
  async sendMessage(
    @CurrentUser() user: any,
    @Args('input') input: SendMessageInput,
  ) {
    const message = await this.messagesService.send(user.id, input);
    
    // Emit to WebSocket room
    this.messagesGateway.server.to(`request:${input.requestId}`).emit('message:new', message);
    
    return message;
  }

  // Field resolvers
  @ResolveField(() => User)
  async sender(@Parent() message: Message) {
    return this.prismaService.user.findUnique({
      where: { id: message.senderId },
    });
  }
}