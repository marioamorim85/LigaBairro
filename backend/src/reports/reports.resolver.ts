import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ReportsService } from './reports.service';
import { ReportUserInput, ReportRequestInput, Report } from './dto/report.dto';
import { User } from '../users/dto/user.dto';
import { Request } from '../requests/dto/request.dto';
import { DataLoaderService } from '../common/dataloader/dataloader.service';

@Resolver(() => Report)
export class ReportsResolver {
  constructor(
    private reportsService: ReportsService,
    private dataLoaderService: DataLoaderService
  ) {}

  @Mutation(() => Report)
  @UseGuards(GqlAuthGuard)
  reportUser(
    @CurrentUser() user: any,
    @Args('input') input: ReportUserInput,
  ) {
    return this.reportsService.reportUser(
      user.id,
      input.targetUserId,
      input.reason,
      input.details,
    );
  }

  @Mutation(() => Report)
  @UseGuards(GqlAuthGuard)
  reportRequest(
    @CurrentUser() user: any,
    @Args('input') input: ReportRequestInput,
  ) {
    return this.reportsService.reportRequest(
      user.id,
      input.requestId,
      input.reason,
      input.details,
    );
  }

  @Query(() => [Report])
  @UseGuards(GqlAuthGuard)
  reports(@CurrentUser() user: any) {
    // Only admin users can see reports
    if (user.role !== 'ADMIN') {
      return [];
    }
    return this.reportsService.findAll();
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async resolveReport(
    @CurrentUser() user: any,
    @Args('reportId') reportId: string,
    @Args('action') action: string,
    @Args('adminNotes', { nullable: true }) adminNotes?: string,
  ) {
    if (user.role !== 'ADMIN') {
      throw new Error('Access denied. Admin role required.');
    }
    
    return this.reportsService.resolveReport(reportId, action, adminNotes);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async dismissReport(
    @CurrentUser() user: any,
    @Args('reportId') reportId: string,
    @Args('adminNotes', { nullable: true }) adminNotes?: string,
  ) {
    if (user.role !== 'ADMIN') {
      throw new Error('Access denied. Admin role required.');
    }
    
    return this.reportsService.dismissReport(reportId, adminNotes);
  }

  // Field Resolvers for Relations
  @ResolveField(() => User, { nullable: true })
  async reporter(@Parent() report: Report): Promise<User | null> {
    if (!report.reporterId) return null;
    return this.reportsService.getUserById(report.reporterId) as any;
  }

  @ResolveField(() => User, { nullable: true })
  async targetUser(@Parent() report: Report): Promise<User | null> {
    if (!report.targetUserId) return null;
    return this.reportsService.getUserById(report.targetUserId) as any;
  }

  @ResolveField(() => Request, { nullable: true })
  async request(@Parent() report: Report): Promise<Request | null> {
    if (!report.requestId) return null;
    
    try {
      // Use DataLoader em vez da consulta direta
      const request = await this.dataLoaderService.getRequestById(report.requestId) as any;
      
      // Se o request não existir, retorna null
      if (!request) return null;
      
      return request;
    } catch (error) {
      console.error('Error fetching request for report:', error);
      return null;
    }
  }
}