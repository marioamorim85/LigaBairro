import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { User, UpdateUserInput, UpdateUserSkillsInput } from './dto/user.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '@prisma/client';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => User, { nullable: true })
  @UseGuards(GqlAuthGuard)
  me(@CurrentUser() user: any) {
    return this.usersService.findById(user.id);
  }

  @Query(() => User, { name: 'user', nullable: true })
  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthGuard, RolesGuard)
  getUserById(@Args('id') id: string) {
    return this.usersService.findById(id);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  updateProfile(
    @CurrentUser() user: any,
    @Args('input') input: UpdateUserInput,
  ) {
    return this.usersService.update(user.id, input);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  updateUserSkills(
    @CurrentUser() user: any,
    @Args('input') input: UpdateUserSkillsInput,
  ) {
    return this.usersService.updateUserSkills(user.id, input.skillIds);
  }
}