import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesResolver } from './messages.resolver';
import { MessagesGateway } from './messages.gateway';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  providers: [MessagesService, MessagesResolver, MessagesGateway],
  exports: [MessagesService, MessagesGateway],
})
export class MessagesModule {}