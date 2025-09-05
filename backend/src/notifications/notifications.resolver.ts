import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { NotificationsService } from './notifications.service';
import { Notification } from './dto/notification.dto';

@Resolver(() => Notification)
export class NotificationsResolver {
  constructor(private notificationsService: NotificationsService) {}

  @Query(() => [Notification])
  @UseGuards(GqlAuthGuard)
  async getUserNotifications(
    @CurrentUser() user: any,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset: number,
    @Args('limit', { type: () => Int, defaultValue: 50 }) limit: number,
  ) {
    return this.notificationsService.findByUserId(user.id, limit, offset);
  }

  @Query(() => Int)
  @UseGuards(GqlAuthGuard)
  async unreadNotificationsCount(@CurrentUser() user: any) {
    return this.notificationsService.getUnreadCount(user.id);
  }

  @Mutation(() => Notification)
  @UseGuards(GqlAuthGuard)
  async markNotificationAsRead(
    @CurrentUser() user: any,
    @Args('id') id: string,
  ) {
    return this.notificationsService.markAsRead(id, user.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async markAllNotificationsAsRead(@CurrentUser() user: any) {
    await this.notificationsService.markAllAsRead(user.id);
    return true;
  }
}