import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ReportsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService
  ) {}

  async reportUser(reporterId: string, targetUserId: string, reason: string, details?: string) {
    const report = await this.prisma.report.create({
      data: {
        reporterId,
        targetUserId,
        reason: details || reason,
      },
    });

    // Obter dados do utilizador denunciado para as notificações
    const targetUser = await this.getUserById(targetUserId);
    const targetName = targetUser?.name || 'Utilizador';

    // Notificar o denunciante que a denúncia foi enviada
    await this.notificationsService.notifyReportSubmitted(
      reporterId,
      reason,
      report.id,
      'USER',
      targetName,
      undefined // Não incluir o ID do alvo para o denunciante
    );

    // Notificar o utilizador denunciado
    if (targetUserId) {
      await this.notificationsService.notifyUserReported(
        targetUserId,
        reason,
        report.id,
        'USER',
        targetName,
        targetUserId
      );
    }

    return report;
  }

  async reportRequest(reporterId: string, requestId: string, reason: string, details?: string) {
    const report = await this.prisma.report.create({
      data: {
        reporterId,
        requestId,
        reason: details || reason,
      },
    });

    // Obter dados do pedido para as notificações
    const request = await this.getRequestById(requestId);
    const requestTitle = request?.title || 'Pedido';

    // Notificar o denunciante que a denúncia foi enviada
    await this.notificationsService.notifyReportSubmitted(
      reporterId,
      reason,
      report.id,
      'REQUEST',
      requestTitle,
      requestId
    );

    // Notificar o dono do pedido denunciado
    const requestOwnerId = await this.getRequestOwnerIdById(requestId);
    if (requestOwnerId) {
      await this.notificationsService.notifyUserReported(
        requestOwnerId,
        reason,
        report.id,
        'REQUEST',
        requestTitle,
        requestId
      );
    }

    return report;
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
    }) as any;
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
    }) as any;
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

    // Determinar o status baseado na ação
    let newStatus = 'RESOLVED';
    if (action === 'WARNING') {
      // Avisos mantêm o status pendente para permitir acompanhamento
      newStatus = 'PENDING';
    }

    // Atualizar status do relatório
    await this.updateReportStatus(reportId, newStatus, adminNotes);

    // Se a ação for aviso ao utilizador, enviar notificação
    if (action === 'WARNING') {
      let userIdToWarn: string | null = null;
      
      // Se for denúncia de utilizador direto
      if (report.targetUserId) {
        userIdToWarn = report.targetUserId;
      } 
      // Se for denúncia de pedido, avisar o dono do pedido
      else if (report.requestId) {
        userIdToWarn = await this.getRequestOwnerIdById(report.requestId);
      }
      
      if (userIdToWarn) {
        // Obter informações do pedido se aplicável
        let requestInfo = null;
        if (report.requestId) {
          requestInfo = await this.getRequestById(report.requestId);
        }
        
        await this.notificationsService.notifyAdminWarning(
          userIdToWarn,
          adminNotes || '',
          reportId,
          report.reason,
          requestInfo?.id,
          requestInfo?.title
        );
      }
    }

    // Se a ação for bloquear utilizador
    if (action === 'BLOCK_USER') {
      let userIdToBlock: string | null = null;
      
      // Se for denúncia de utilizador direto
      if (report.targetUserId) {
        userIdToBlock = report.targetUserId;
      } 
      // Se for denúncia de pedido, bloquear o dono do pedido
      else if (report.requestId) {
        userIdToBlock = await this.getRequestOwnerIdById(report.requestId);
      }
      
      if (userIdToBlock) {
        await this.prisma.user.update({
          where: { id: userIdToBlock },
          data: { isActive: false } as any,
        });

        await this.notificationsService.notifyUserBlocked(
          userIdToBlock,
          reportId,
          report.reason,
          adminNotes || ''
        );
      }
    }

    // Se a ação for remover pedido
    if (action === 'REMOVE_REQUEST' && report.requestId) {
      // Atualizar status do pedido
      await this.prisma.request.update({
        where: { id: report.requestId },
        data: { status: 'CANCELLED' },
      });
      
      // Notificar o dono do pedido que foi removido
      const requestOwnerId = await this.getRequestOwnerIdById(report.requestId);
      const request = await this.getRequestById(report.requestId);
      if (requestOwnerId) {
        await this.notificationsService.notifyRequestRemoved(
          requestOwnerId,
          report.requestId,
          adminNotes || '',
          report.reason,
          request?.title
        );
      }
    }

    if (action === 'NO_ACTION') {
        const targetUserId = report.targetUserId || (report.requestId ? await this.getRequestOwnerIdById(report.requestId) : null);

        if (targetUserId) {
            await this.notificationsService.notifyTargetUserReportResolved(
                targetUserId,
                reportId,
                report.reason,
                adminNotes || '',
                report.requestId
            );
        }
    }

    // Notificar o denunciante sobre a resolução
    if (report.reporterId) {
      await this.notificationsService.notifyReportResolved(
        report.reporterId,
        adminNotes || '',
        reportId,
        report.reason,
        action,
        report.requestId
      );
    }

    return true;
  }

  async dismissReport(reportId: string, adminNotes?: string) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new Error('Report not found');
    }

    // Atualizar status do relatório
    await this.updateReportStatus(reportId, 'DISMISSED', adminNotes);

    // Enviar notificação ao denunciante
    if (report.reporterId) {
      await this.notificationsService.notifyReportDismissed(
        report.reporterId,
        adminNotes || '',
        reportId,
        report.reason,
        report.requestId
      );
    }

    // Notificar o utilizador alvo da denúncia
    const targetUserId = report.targetUserId || (report.requestId ? await this.getRequestOwnerIdById(report.requestId) : null);

    if (targetUserId) {
      await this.notificationsService.notifyTargetUserReportDismissed(
        targetUserId,
        reportId,
        report.reason,
        report.requestId
      );
    }

    return true;
  }

  // Helper methods for field resolvers
  async getUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        ratingAvg: true,
        isActive: true,
      },
    }) as any;
  }

  async getRequestById(requestId: string) {
    if (!requestId) return null;
    
    try {
      const request = await this.prisma.request.findUnique({
        where: { id: requestId },
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          status: true,
          requester: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
              isActive: true,
            },
          },
        },
      });

      // Se o request não existir, retorna null
      if (!request) return null;

      return request as any;
    } catch (error) {
      console.error('Error in getRequestById:', error);
      return null;
    }
  }

  async getRequestOwnerIdById(requestId: string): Promise<string | null> {
    if (!requestId) return null;
    
    try {
      const request = await this.prisma.request.findUnique({
        where: { id: requestId },
        select: {
          requesterId: true,
        },
      });

      return request?.requesterId || null;
    } catch (error) {
      console.error('Error in getRequestOwnerIdById:', error);
      return null;
    }
  }
}