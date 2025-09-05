import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApplicationsService } from './applications.service';
import { MessagesGateway } from '../messages/messages.gateway';
import { Application, ApplyToRequestInput, RemoveApplicationResult } from './dto/application.dto';
import { PrismaService } from '../common/prisma/prisma.service';

@Resolver(() => Application)
export class ApplicationsResolver {
  constructor(
    private applicationsService: ApplicationsService,
    private messagesGateway: MessagesGateway,
    private prismaService: PrismaService,
  ) {}

  @Mutation(() => Application)
  @UseGuards(GqlAuthGuard)
  async applyToRequest(
    @CurrentUser() user: any,
    @Args('input') input: ApplyToRequestInput,
  ) {
    console.log('=== APPLY TO REQUEST REACHED ===');
    console.log('User:', JSON.stringify(user, null, 2));
    console.log('Input:', JSON.stringify(input, null, 2));
    
    try {
      const application = await this.applicationsService.apply(user.id, input);
      console.log('Application created successfully:', application);
      
      // Emit WebSocket notification to request owner
      this.messagesGateway.emitNewApplication(input.requestId, application);
      
      return application;
    } catch (error) {
      console.error('Error in applyToRequest service:', error);
      throw error;
    }
  }

  @Mutation(() => Application)
  @UseGuards(GqlAuthGuard)
  async acceptApplication(
    @CurrentUser() user: any,
    @Args('applicationId') applicationId: string,
  ) {
    const application = await this.applicationsService.accept(applicationId, user.id);
    
    // Emit WebSocket notifications
    this.messagesGateway.emitRequestStatusChange(application.request.id, 'IN_PROGRESS');
    this.messagesGateway.emitApplicationAccepted(applicationId, application);
    
    return application;
  }

  @Query(() => [Application])
  @UseGuards(GqlAuthGuard)
  myApplications(@CurrentUser() user: any) {
    return this.applicationsService.myApplications(user.id);
  }

  @Mutation(() => RemoveApplicationResult)
  @UseGuards(GqlAuthGuard)
  async removeApplication(
    @CurrentUser() user: any,
    @Args('applicationId') applicationId: string,
  ) {
    console.log('=== REMOVE APPLICATION REACHED ===');
    console.log('User:', JSON.stringify(user, null, 2));
    console.log('Application ID:', applicationId);
    
    try {
      const result = await this.applicationsService.removeApplication(applicationId, user.id);
      console.log('Application removed successfully:', result);
      
      // Emit WebSocket notification about application removal
      this.messagesGateway.emitApplicationRemoved(applicationId, result);
      
      return result;
    } catch (error) {
      console.error('Error in removeApplication resolver:', error);
      throw error;
    }
  }

  // Field resolvers
  @ResolveField()
  async helper(@Parent() application: Application) {
    return this.prismaService.user.findUnique({
      where: { id: application.helperId },
    });
  }

  @ResolveField()
  async request(@Parent() application: Application) {
    return this.prismaService.request.findUnique({
      where: { id: application.requestId },
    });
  }
}