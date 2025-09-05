import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards, Injectable } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequestsService } from './requests.service';
import { Request, CreateRequestInput, UpdateRequestInput, SearchRequestsInput, RequestStatus } from './dto/request.dto';
import { PrismaService } from '../common/prisma/prisma.service';

@Resolver(() => Request)
export class RequestsResolver {
  constructor(
    private requestsService: RequestsService,
    private prismaService: PrismaService,
  ) {}

  @Mutation(() => Request)
  @UseGuards(GqlAuthGuard)
  createRequest(
    @CurrentUser() user: any,
    @Args('input') input: CreateRequestInput,
  ) {
    return this.requestsService.create(user.id, input);
  }

  @Query(() => [Request])
  searchRequests(@Args('input') input: SearchRequestsInput) {
    return this.requestsService.search(input);
  }

  @Query(() => Request, { nullable: true })
  request(@Args('id') id: string) {
    return this.requestsService.findById(id);
  }

  @Mutation(() => Request)
  @UseGuards(GqlAuthGuard)
  updateRequest(
    @CurrentUser() user: any,
    @Args('id') id: string,
    @Args('input') input: UpdateRequestInput,
  ) {
    return this.requestsService.update(id, input, user.id);
  }

  @Mutation(() => Request)
  @UseGuards(GqlAuthGuard)
  updateRequestStatus(
    @CurrentUser() user: any,
    @Args('id') id: string,
    @Args('status') status: RequestStatus,
  ) {
    return this.requestsService.updateStatus(id, status, user.id);
  }

  // Field resolvers
  @ResolveField()
  async requester(@Parent() request: Request) {
    return this.prismaService.user.findUnique({
      where: { id: request.requesterId },
    });
  }

  @ResolveField()
  async applications(@Parent() request: Request) {
    return this.prismaService.application.findMany({
      where: { requestId: request.id },
      include: {
        helper: true,
      },
    });
  }

  @ResolveField()
  async messages(@Parent() request: Request) {
    return this.prismaService.message.findMany({
      where: { requestId: request.id },
      include: {
        sender: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}