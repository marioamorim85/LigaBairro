import { Resolver, Query } from '@nestjs/graphql';
import { SkillsService } from './skills.service';
import { Skill } from '../users/dto/user.dto';

@Resolver(() => Skill)
export class SkillsResolver {
  constructor(private skillsService: SkillsService) {}

  @Query(() => [Skill])
  skills() {
    return this.skillsService.findAll();
  }
}