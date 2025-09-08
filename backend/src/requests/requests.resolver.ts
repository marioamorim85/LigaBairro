import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards, Injectable } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequestsService } from './requests.service';
import { Request, CreateRequestInput, UpdateRequestInput, SearchRequestsInput, RequestStatus } from './dto/request.dto';
import { PrismaService } from '../common/prisma/prisma.service';
import { DataLoaderService } from '../common/dataloader/dataloader.service';

@Resolver(() => Request)
export class RequestsResolver {
  constructor(
    private requestsService: RequestsService,
    private prismaService: PrismaService,
    private dataLoaderService: DataLoaderService,
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

  // Admin mutations
  @Query(() => [Request])
  @UseGuards(GqlAuthGuard)
  getAllRequestsForAdmin(@CurrentUser() user: any) {
    if (user.role !== 'ADMIN') {
      throw new Error('Access denied. Admin role required.');
    }
    return this.requestsService.getAllRequestsForAdmin();
  }

  @Mutation(() => Request)
  @UseGuards(GqlAuthGuard)
  adminCancelRequest(
    @CurrentUser() user: any,
    @Args('requestId') requestId: string,
    @Args('adminNotes', { nullable: true }) adminNotes?: string,
  ) {
    if (user.role !== 'ADMIN') {
      throw new Error('Access denied. Admin role required.');
    }
    return this.requestsService.adminCancelRequest(requestId, adminNotes);
  }

  @Mutation(() => Request)
  @UseGuards(GqlAuthGuard)
  adminPutRequestOnStandby(
    @CurrentUser() user: any,
    @Args('requestId') requestId: string,
    @Args('adminNotes', { nullable: true }) adminNotes?: string,
  ) {
    if (user.role !== 'ADMIN') {
      throw new Error('Access denied. Admin role required.');
    }
    return this.requestsService.adminPutRequestOnStandby(requestId, adminNotes);
  }

  @Mutation(() => Request)
  @UseGuards(GqlAuthGuard)
  adminRequestImprovement(
    @CurrentUser() user: any,
    @Args('requestId') requestId: string,
    @Args('adminNotes', { nullable: true }) adminNotes?: string,
  ) {
    if (user.role !== 'ADMIN') {
      throw new Error('Access denied. Admin role required.');
    }
    return this.requestsService.adminRequestImprovement(requestId, adminNotes);
  }

  @Mutation(() => Request)
  @UseGuards(GqlAuthGuard)
  adminReopenRequest(
    @CurrentUser() user: any,
    @Args('requestId') requestId: string,
    @Args('adminNotes', { nullable: true }) adminNotes?: string,
  ) {
    if (user.role !== 'ADMIN') {
      throw new Error('Access denied. Admin role required.');
    }
    return this.requestsService.adminReopenRequest(requestId, adminNotes);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  adminDeleteRequest(
    @CurrentUser() user: any,
    @Args('requestId') requestId: string,
  ) {
    if (user.role !== 'ADMIN') {
      throw new Error('Access denied. Admin role required.');
    }
    return this.requestsService.adminDeleteRequest(requestId);
  }

  // Optimized field resolvers with DataLoader
  @ResolveField()
  async requester(@Parent() request: Request) {
    return this.dataLoaderService.getUserById(request.requesterId);
  }

  @ResolveField()
  async applications(@Parent() request: Request) {
    return this.dataLoaderService.getApplicationsByRequestId(request.id);
  }

  @ResolveField()
  async messages(@Parent() request: Request) {
    return this.dataLoaderService.getMessagesByRequestId(request.id);
  }
}