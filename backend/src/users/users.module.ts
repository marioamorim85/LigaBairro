import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  imports: [UploadsModule],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}