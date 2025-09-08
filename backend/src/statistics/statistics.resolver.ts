import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { StatisticsService } from './statistics.service';
import { AdminStats } from './dto/admin-stats.dto';
import { UserManagement, ActivityReport } from './dto/user-management.dto';
import { ForbiddenException } from '@nestjs/common';

@Resolver()
export class StatisticsResolver {
  constructor(private statisticsService: StatisticsService) {}

  @Query(() => AdminStats)
  @UseGuards(GqlAuthGuard)
  async adminStats(@CurrentUser() user: any): Promise<AdminStats> {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied. Admin role required.');
    }
    
    return this.statisticsService.getAdminStats();
  }

  @Query(() => [UserManagement])
  @UseGuards(GqlAuthGuard)
  async usersForManagement(@CurrentUser() user: any): Promise<UserManagement[]> {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied. Admin role required.');
    }
    
    return this.statisticsService.getUsersForManagement();
  }

  @Query(() => [ActivityReport])
  @UseGuards(GqlAuthGuard)
  async activityReport(
    @CurrentUser() user: any,
    @Args('days', { type: () => Int, defaultValue: 30 }) days: number,
  ): Promise<ActivityReport[]> {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied. Admin role required.');
    }
    
    return this.statisticsService.getActivityReport(days);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async toggleUserStatus(
    @CurrentUser() user: any,
    @Args('userId') userId: string,
  ): Promise<boolean> {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied. Admin role required.');
    }
    
    return this.statisticsService.toggleUserStatus(userId);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async updateUserRole(
    @CurrentUser() user: any,
    @Args('userId') userId: string,
    @Args('newRole') newRole: string,
  ): Promise<boolean> {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied. Admin role required.');
    }
    
    if (newRole !== 'USER' && newRole !== 'ADMIN') {
      throw new ForbiddenException('Invalid role. Must be USER or ADMIN.');
    }
    
    return this.statisticsService.updateUserRole(userId, newRole as 'USER' | 'ADMIN');
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteUser(
    @CurrentUser() user: any,
    @Args('userId') userId: string,
  ): Promise<boolean> {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied. Admin role required.');
    }
    
    return this.statisticsService.deleteUser(userId);
  }
}