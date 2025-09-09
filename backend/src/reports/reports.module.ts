import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsResolver } from './reports.resolver';
import { DataLoaderModule } from '../common/dataloader/dataloader.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [DataLoaderModule, NotificationsModule],
  providers: [ReportsService, ReportsResolver],
  exports: [ReportsService],
})
export class ReportsModule {}