import { Module, forwardRef } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsResolver } from './applications.resolver';
import { RequestsModule } from '../requests/requests.module';
import { MessagesModule } from '../messages/messages.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    RequestsModule, 
    forwardRef(() => MessagesModule),
    NotificationsModule,
  ],
  providers: [ApplicationsService, ApplicationsResolver],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}