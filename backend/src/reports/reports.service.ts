import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async reportUser(reporterId: string, targetUserId: string, reason: string, details?: string) {
    return this.prisma.report.create({
      data: {
        reporterId,
        targetUserId,
        reason: details || reason,
      },
    });
  }

  async reportRequest(reporterId: string, requestId: string, reason: string, details?: string) {
    return this.prisma.report.create({
      data: {
        reporterId,
        requestId,
        reason: details || reason,
      },
    });
  }

  async findAll() {
    return this.prisma.report.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}