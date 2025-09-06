import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { MessagesGateway } from '../messages/messages.gateway';
import { DataLoaderService } from '../common/dataloader/dataloader.service';
import { ApplyToRequestInput } from './dto/application.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private messagesGateway: MessagesGateway,
    private dataLoaderService: DataLoaderService,
  ) {}

  async apply(userId: string, input: ApplyToRequestInput) {
    try {
      // Check if request exists and is open
      const request = await this.prisma.request.findUnique({
        where: { id: input.requestId },
      });
      
      if (!request) {
        throw new BadRequestException('Pedido não encontrado');
      }

      if (request.status !== 'OPEN') {
        throw new BadRequestException('Pedido já não está disponível');
      }

      if (request.requesterId === userId) {
        throw new BadRequestException('Não pode candidatar-se ao próprio pedido');
      }

      // Check if user already applied
      const existingApplication = await this.prisma.application.findFirst({
        where: {
          requestId: input.requestId,
          helperId: userId,
        },
      });
      
      if (existingApplication) {
        throw new BadRequestException('Já se candidatou a este pedido');
      }
      const application = await this.prisma.application.create({
        data: {
          requestId: input.requestId,
          helperId: userId,
          message: input.message,
        },
        include: {
          helper: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              ratingAvg: true,
            },
          },
          request: {
            select: {
              id: true,
              title: true,
              requester: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
      
      // Clear DataLoader cache to ensure GraphQL returns fresh data
      this.dataLoaderService.clearApplicationCache(input.requestId);
      this.dataLoaderService.clearRequestCache(input.requestId);
      
      // Get existing applicants to notify them of the new application
      const existingApplications = await this.prisma.application.findMany({
        where: {
          requestId: input.requestId,
          helperId: { not: userId }, // Exclude the current applicant
        },
        select: {
          helperId: true,
        },
      });
      
      const existingApplicantIds = existingApplications.map(app => app.helperId);
      
      // Send notifications
      await Promise.all([
        // Notify request owner
        this.notificationsService.notifyNewApplication(
          request.requesterId,
          application.helper.name,
          request.title,
          request.id,
        ),
        // Notify existing applicants
        existingApplicantIds.length > 0 
          ? this.notificationsService.notifyOtherApplicants(
              existingApplicantIds,
              application.helper.name,
              request.title,
              request.id,
            )
          : Promise.resolve(),
      ]);
      
      // Emit WebSocket event to update the request page in real-time
      this.messagesGateway.emitNewApplication(request.id, {
        type: 'new',
        application: application,
        message: 'Nova candidatura recebida'
      });
      
      return application;
    } catch (error) {
      throw error;
    }
  }

  async accept(applicationId: string, requesterId: string) {
    // Get application with request
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        request: true,
      },
    });

    if (!application) {
      throw new BadRequestException('Candidatura não encontrada');
    }

    if (application.request.requesterId !== requesterId) {
      throw new BadRequestException('Apenas o autor do pedido pode aceitar candidaturas');
    }

    if (application.request.status !== 'OPEN') {
      throw new BadRequestException('Pedido já não está disponível');
    }

    // Get all applications for notifications
    const allApplications = await this.prisma.application.findMany({
      where: { requestId: application.requestId },
      include: {
        helper: {
          select: { id: true, name: true },
        },
      },
    });

    // Clear DataLoader cache before transaction to ensure fresh data
    this.dataLoaderService.clearApplicationCache(application.requestId);
    this.dataLoaderService.clearRequestCache(application.requestId);

    // Accept this application and reject others
    await this.prisma.$transaction([
      // Accept this application
      this.prisma.application.update({
        where: { id: applicationId },
        data: { status: 'ACCEPTED' },
      }),
      // Reject other applications
      this.prisma.application.updateMany({
        where: {
          requestId: application.requestId,
          id: { not: applicationId },
        },
        data: { status: 'REJECTED' },
      }),
      // Update request status
      this.prisma.request.update({
        where: { id: application.requestId },
        data: { status: 'IN_PROGRESS' },
      }),
    ]);

    // Send notifications
    await Promise.all([
      // Notify accepted applicant
      this.notificationsService.notifyApplicationAccepted(
        application.helperId,
        application.request.title,
        application.requestId,
      ),
      // Notify rejected applicants
      ...allApplications
        .filter(app => app.id !== applicationId)
        .map(app =>
          this.notificationsService.notifyApplicationRejected(
            app.helperId,
            application.request.title,
            application.requestId,
          ),
        ),
    ]);

    // Get updated application with full data for WebSocket
    const updatedApplication = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        helper: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        request: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
    });

    // Emit real-time updates via WebSocket
    if (updatedApplication) {
      // 1. Notify the request room about application acceptance
      this.messagesGateway.emitNewApplication(application.requestId, {
        type: 'accepted',
        application: updatedApplication,
      });

      // 2. Notify request room about status change to IN_PROGRESS
      this.messagesGateway.emitRequestStatusChange(application.requestId, 'IN_PROGRESS');

      // 3. Notify all applicants individually about their status
      allApplications.forEach(app => {
        if (app.id === applicationId) {
          // Accepted applicant - send personalized notification
          this.messagesGateway.emitApplicationStatusToUser(app.helperId, {
            type: 'ACCEPTED',
            applicationId: app.id,
            application: updatedApplication,
            message: 'A tua candidatura foi aceite!'
          });
        } else {
          // Rejected applicants - send personalized notification
          this.messagesGateway.emitApplicationStatusToUser(app.helperId, {
            type: 'REJECTED',
            applicationId: app.id,
            application: {
              ...app,
              status: 'REJECTED',
            },
            message: 'A tua candidatura foi rejeitada automaticamente porque outra foi aceite.'
          });
        }
      });
    }

    return this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        helper: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        request: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async myApplications(userId: string) {
    return this.prisma.application.findMany({
      where: { helperId: userId },
      include: {
        request: {
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
            status: true,
            createdAt: true,
            requester: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
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

  async removeApplication(applicationId: string, userId: string) {
    try {
      // Check if application exists and belongs to user
      const application = await this.prisma.application.findUnique({
        where: { id: applicationId },
        include: {
          request: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
        },
      });

      if (!application) {
        throw new BadRequestException('Candidatura não encontrada');
      }

      if (application.helperId !== userId) {
        throw new BadRequestException('Apenas o candidato pode remover a própria candidatura');
      }

      // Only allow removal if application is still APPLIED (not accepted/rejected)
      if (application.status !== 'APPLIED') {
        throw new BadRequestException('Não é possível remover uma candidatura que já foi processada');
      }

      // Only allow removal if request is still OPEN
      if (application.request.status !== 'OPEN') {
        throw new BadRequestException('Não é possível remover candidatura de um pedido que já não está aberto');
      }
      await this.prisma.application.delete({
        where: { id: applicationId },
      });
      
      // Get user info to send notification
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
      });

      // Get request owner to notify
      const request = await this.prisma.request.findUnique({
        where: { id: application.request.id },
        select: { requesterId: true },
      });

      // Notify request owner that application was removed
      if (user && request) {
        await this.notificationsService.notifyApplicationRemoved(
          request.requesterId,
          user.name,
          application.request.title,
          application.request.id,
        );
      }
      
      // Clear DataLoader cache to ensure GraphQL returns fresh data
      this.dataLoaderService.clearApplicationCache(application.request.id);
      this.dataLoaderService.clearRequestCache(application.request.id);
      
      // Emit WebSocket event to update the request page in real-time
      this.messagesGateway.emitNewApplication(application.request.id, {
        type: 'removed',
        applicationId: applicationId,
        message: 'Candidatura removida'
      });
      
      return {
        id: applicationId,
        success: true,
        message: 'Candidatura removida com sucesso',
      };
    } catch (error) {
      throw error;
    }
  }
}