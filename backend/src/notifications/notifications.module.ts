import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsResolver } from './notifications.resolver';

@Module({
  providers: [NotificationsService, NotificationsResolver],
  exports: [NotificationsService], // Export the service so other modules can use it
})
export class NotificationsModule {}