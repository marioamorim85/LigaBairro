import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsResolver } from './requests.resolver';
import { GeoService } from '../common/geo/geo.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  providers: [RequestsService, RequestsResolver, GeoService],
  exports: [RequestsService],
})
export class RequestsModule {}