import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { UploadsService } from '../uploads/uploads.service';
import { CreateUserInput, UpdateUserInput } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private uploadsService: UploadsService,
  ) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByGoogleId(googleId: string) {
    return this.prisma.user.findUnique({
      where: { googleId },
    });
  }

  async create(input: CreateUserInput) {
    return this.prisma.user.create({
      data: input,
    });
  }

  async update(id: string, input: UpdateUserInput) {
    return this.prisma.user.update({
      where: { id },
      data: input,
    });
  }

  async updateUserSkills(userId: string, skillIds: string[]) {
    // Remove existing skills
    await this.prisma.userSkill.deleteMany({
      where: { userId },
    });

    // Add new skills
    if (skillIds.length > 0) {
      await this.prisma.userSkill.createMany({
        data: skillIds.map(skillId => ({
          userId,
          skillId,
        })),
      });
    }

    // Return updated user with skills
    return this.findById(userId);
  }

  async updateAvatar(userId: string, file: Express.Multer.File) {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Delete old avatar if exists
    if (user.avatarUrl) {
      const oldFilename = user.avatarUrl.split('/').pop();
      if (oldFilename) {
        await this.uploadsService.deleteImage(oldFilename);
      }
    }

    // Upload new avatar
    const { url } = await this.uploadsService.uploadAvatar(file);
    
    // Update user avatar URL
    return this.update(userId, { avatarUrl: url });
  }
}