import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsResolver } from './requests.resolver';
import { GeoService } from '../common/geo/geo.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { DataLoaderModule } from '../common/dataloader/dataloader.module';

@Module({
  imports: [NotificationsModule, DataLoaderModule],
  providers: [RequestsService, RequestsResolver, GeoService],
  exports: [RequestsService],
})
export class RequestsModule {}