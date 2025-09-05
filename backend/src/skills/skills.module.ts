import { Module } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { SkillsResolver } from './skills.resolver';

@Module({
  providers: [SkillsService, SkillsResolver],
  exports: [SkillsService],
})
export class SkillsModule {}