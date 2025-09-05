import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { NotificationType } from '@prisma/client';

export interface CreateNotificationData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
}

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateNotificationData) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data || null,
      },
    });

    // Aqui podemos adicionar lógica para enviar email/push notifications
    this.sendEmailIfEnabled(data.userId, data.title, data.message);

    return notification;
  }

  async findByUserId(userId: string, limit: number = 50, offset: number = 0) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async markAsRead(id: string, userId: string) {
    return this.prisma.notification.update({
      where: { 
        id,
        userId // Ensure user owns the notification
      },
      data: { read: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { 
        userId,
        read: false 
      },
      data: { read: true },
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });
  }

  private async sendEmailIfEnabled(userId: string, title: string, message: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { emailNotifications: true, email: true, name: true },
    });

    if (user?.emailNotifications) {
      // Aqui integraremos com um serviço de email como SendGrid, Nodemailer, etc.
      console.log(`📧 Email notification to ${user.email}: ${title} - ${message}`);
      // TODO: Implementar envio de email real
    }
  }

  // Métodos de conveniência para diferentes tipos de notificações
  async notifyNewApplication(requestOwnerId: string, applicantName: string, requestTitle: string, requestId: string) {
    return this.create({
      userId: requestOwnerId,
      type: 'NEW_APPLICATION',
      title: 'Nova candidatura',
      message: `${applicantName} candidatou-se ao teu pedido "${requestTitle}"`,
      data: { requestId, applicantName },
    });
  }

  async notifyApplicationAccepted(applicantId: string, requestTitle: string, requestId: string) {
    return this.create({
      userId: applicantId,
      type: 'APPLICATION_ACCEPTED',
      title: 'Candidatura aceite',
      message: `A tua candidatura para "${requestTitle}" foi aceite!`,
      data: { requestId },
    });
  }

  async notifyApplicationRejected(applicantId: string, requestTitle: string, requestId: string) {
    return this.create({
      userId: applicantId,
      type: 'APPLICATION_REJECTED',
      title: 'Candidatura rejeitada',
      message: `A tua candidatura para "${requestTitle}" foi rejeitada.`,
      data: { requestId },
    });
  }

  async notifyNewMessage(userId: string, senderName: string, requestTitle: string, requestId: string) {
    return this.create({
      userId,
      type: 'NEW_MESSAGE',
      title: 'Nova mensagem',
      message: `${senderName} enviou uma mensagem em "${requestTitle}"`,
      data: { requestId, senderName },
    });
  }

  async notifyRequestStatusChanged(userId: string, requestTitle: string, newStatus: string, requestId: string) {
    const statusMap = {
      'IN_PROGRESS': 'em progresso',
      'DONE': 'concluído',
      'CANCELLED': 'cancelado',
    };

    return this.create({
      userId,
      type: 'REQUEST_STATUS_CHANGED',
      title: 'Estado do pedido alterado',
      message: `O pedido "${requestTitle}" está agora ${statusMap[newStatus] || newStatus.toLowerCase()}`,
      data: { requestId, newStatus },
    });
  }

  async notifyNewReview(userId: string, reviewerName: string, rating: number, requestTitle: string, requestId: string) {
    return this.create({
      userId,
      type: 'NEW_REVIEW',
      title: 'Nova avaliação',
      message: `${reviewerName} avaliou-te com ${rating} estrela${rating !== 1 ? 's' : ''} em "${requestTitle}"`,
      data: { reviewerName, rating, requestTitle, requestId },
    });
  }

  async notifyApplicationRemoved(requestOwnerId: string, applicantName: string, requestTitle: string, requestId: string) {
    return this.create({
      userId: requestOwnerId,
      type: 'NEW_APPLICATION',
      title: 'Candidatura removida',
      message: `${applicantName} removeu a candidatura ao pedido "${requestTitle}"`,
      data: { requestId, applicantName },
    });
  }

  async notifyOtherApplicants(applicantIds: string[], newApplicantName: string, requestTitle: string, requestId: string) {
    return Promise.all(
      applicantIds.map(applicantId =>
        this.create({
          userId: applicantId,
          type: 'NEW_APPLICATION',
          title: 'Nova candidatura',
          message: `${newApplicantName} candidatou-se também ao pedido "${requestTitle}"`,
          data: { requestId, applicantName: newApplicantName },
        })
      )
    );
  }
}