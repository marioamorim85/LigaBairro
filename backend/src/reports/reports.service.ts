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
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        targetUser: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            isActive: true,
          },
        },
        request: {
          select: {
            id: true,
            title: true,
            status: true,
            requester: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getReportStats() {
    const [totalReports, pendingReports, resolvedReports, dismissedReports] = await Promise.all([
      this.prisma.report.count(),
      this.prisma.report.count({ where: { status: 'PENDING' } }),
      this.prisma.report.count({ where: { status: 'RESOLVED' } }),
      this.prisma.report.count({ where: { status: 'DISMISSED' } }),
    ]);

    return {
      totalReports,
      pendingReports,
      resolvedReports,
      dismissedReports,
    };
  }

  async getReportsByStatus(status: string) {
    return this.prisma.report.findMany({
      where: { status },
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        targetUser: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            isActive: true,
          },
        },
        request: {
          select: {
            id: true,
            title: true,
            status: true,
            requester: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateReportStatus(reportId: string, status: string, adminNotes?: string) {
    const updateData: any = { status };
    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }

    return this.prisma.report.update({
      where: { id: reportId },
      data: updateData,
    });
  }

  async resolveReport(reportId: string, action: string, adminNotes?: string) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new Error('Report not found');
    }

    // Atualizar status do relatório
    await this.updateReportStatus(reportId, 'RESOLVED', adminNotes);

    // Se a ação for bloquear utilizador
    if (action === 'BLOCK_USER' && report.targetUserId) {
      await this.prisma.user.update({
        where: { id: report.targetUserId },
        data: { isActive: false },
      });
    }

    // Se a ação for remover pedido
    if (action === 'REMOVE_REQUEST' && report.requestId) {
      await this.prisma.request.update({
        where: { id: report.requestId },
        data: { status: 'CANCELLED' },
      });
    }

    return true;
  }

  async dismissReport(reportId: string, adminNotes?: string) {
    return this.updateReportStatus(reportId, 'DISMISSED', adminNotes);
  }
}