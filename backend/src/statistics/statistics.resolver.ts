import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { StatisticsService } from './statistics.service';
import { AdminStats } from './dto/admin-stats.dto';
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
}