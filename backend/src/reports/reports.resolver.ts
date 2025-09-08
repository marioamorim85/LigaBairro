import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ReportsService } from './reports.service';
import { ReportUserInput, ReportRequestInput, Report } from './dto/report.dto';

@Resolver()
export class ReportsResolver {
  constructor(private reportsService: ReportsService) {}

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
}