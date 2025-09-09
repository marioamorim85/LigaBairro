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

  // Helper para mapear motivos de denúncia para português
  private getReasonText(reason: string): string {
    const reasonMap = {
      'SPAM': 'spam',
      'INAPPROPRIATE': 'conteúdo inadequado',
      'SCAM': 'burla/fraude',
      'HARASSMENT': 'assédio',
      'FAKE_PROFILE': 'perfil falso',
      'OFFENSIVE_LANGUAGE': 'linguagem ofensiva',
      'FALSE_INFORMATION': 'informação falsa',
      'DUPLICATE_POST': 'publicação duplicada',
      'PRIVACY_VIOLATION': 'violação de privacidade',
      'COPYRIGHT_VIOLATION': 'violação de direitos autorais',
      'ILLEGAL_CONTENT': 'conteúdo ilegal',
      'ABUSIVE_PRICING': 'preços abusivos',
      'OTHER': 'outro motivo'
    };
    return reasonMap[reason as keyof typeof reasonMap] || reason.toLowerCase();
  }

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
      message: `${applicantName} candidatou-se ao teu pedido "${requestTitle}".`,
      data: { requestId, applicantName, href: `/requests/${requestId}` },
    });
  }

  async notifyApplicationAccepted(applicantId: string, requestTitle: string, requestId: string) {
    return this.create({
      userId: applicantId,
      type: 'APPLICATION_ACCEPTED',
      title: 'Candidatura aceite',
      message: `A tua candidatura para "${requestTitle}" foi aceite.`,
      data: { requestId, href: `/requests/${requestId}` },
    });
  }

  async notifyApplicationRejected(applicantId: string, requestTitle: string, requestId: string) {
    return this.create({
      userId: applicantId,
      type: 'APPLICATION_REJECTED',
      title: 'Candidatura rejeitada',
      message: `A tua candidatura para "${requestTitle}" foi rejeitada.`,
      data: { requestId, href: `/requests/${requestId}` },
    });
  }

  async notifyNewMessage(userId: string, senderName: string, requestTitle: string, requestId: string) {
    return this.create({
      userId,
      type: 'NEW_MESSAGE',
      title: 'Nova mensagem',
      message: `${senderName} enviou uma mensagem em "${requestTitle}".`,
      data: { requestId, senderName, href: `/requests/${requestId}` },
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
      message: `O pedido "${requestTitle}" está agora ${statusMap[newStatus] || newStatus.toLowerCase()}.`,
      data: { requestId, newStatus, href: `/requests/${requestId}` },
    });
  }

  async notifyNewReview(userId: string, reviewerName: string, rating: number, requestTitle: string, requestId: string) {
    return this.create({
      userId,
      type: 'NEW_REVIEW',
      title: 'Nova avaliação',
      message: `${reviewerName} avaliou-te com ${rating} estrela${rating !== 1 ? 's' : ''} em "${requestTitle}".`,
      data: { reviewerName, rating, requestTitle, requestId, href: `/requests/${requestId}` },
    });
  }

  async notifyApplicationRemoved(requestOwnerId: string, applicantName: string, requestTitle: string, requestId: string) {
    return this.create({
      userId: requestOwnerId,
      type: 'NEW_APPLICATION',
      title: 'Candidatura removida',
      message: `${applicantName} removeu a candidatura ao pedido "${requestTitle}".`,
      data: { requestId, applicantName, href: `/requests/${requestId}` },
    });
  }

  async notifyOtherApplicants(applicantIds: string[], newApplicantName: string, requestTitle: string, requestId: string) {
    return Promise.all(
      applicantIds.map(applicantId =>
        this.create({
          userId: applicantId,
          type: 'NEW_APPLICATION',
          title: 'Nova candidatura',
          message: `${newApplicantName} candidatou-se também ao pedido "${requestTitle}".`,
          data: { requestId, applicantName: newApplicantName, href: `/requests/${requestId}` },
        })
      )
    );
  }

  async notifyAdminWarning(userId: string, adminNotes: string, reportId: string, reportReason: string, requestId?: string, requestTitle?: string) {
    const reasonText = this.getReasonText(reportReason);
    const adminMessage = adminNotes ? ` Nota do administrador: "${adminNotes}"` : '';
    let message: string;
    let href: string | undefined = undefined;

    if (requestId && requestTitle) {
      message = `Recebeste um aviso da administração sobre o teu pedido "${requestTitle}" devido a uma denúncia por ${reasonText}.${adminMessage}`;
      href = `/requests/${requestId}`;
    } else {
      message = `Recebeste um aviso da administração relacionado com uma denúncia por ${reasonText}.${adminMessage}`;
      // No href for user-only warnings
    }

    return this.create({
      userId,
      type: 'ADMIN_WARNING',
      title: 'Aviso da administração',
      message,
      data: { 
        reportId, 
        reportReason,
        requestId,
        requestTitle,
        targetType: requestId ? 'REQUEST' : 'USER',
        href,
      },
    });
  }

  async notifyReportDismissed(userId: string, adminNotes: string, reportId: string, reportReason: string, requestId?: string) {
    const reasonText = this.getReasonText(reportReason);
    const adminMessage = adminNotes ? ` Nota do administrador: "${adminNotes}"` : '';

    return this.create({
      userId,
      type: 'REQUEST_STATUS_CHANGED',
      title: 'Denúncia rejeitada',
      message: `A tua denúncia por "${reasonText}" foi analisada e rejeitada pela administração.${adminMessage}`,
      data: { reportId, reportReason, status: 'DISMISSED', requestId, href: requestId ? `/requests/${requestId}` : undefined },
    });
  }

  async notifyTargetUserReportDismissed(userId: string, reportId: string, reportReason: string, requestId?: string) {
    const reasonText = this.getReasonText(reportReason);

    return this.create({
      userId,
      type: 'REQUEST_STATUS_CHANGED',
      title: 'Denúncia resolvida',
      message: `Uma denúncia contra ti por "${reasonText}" foi analisada e rejeitada. Nenhuma ação foi tomada.`,
      data: { reportId, reportReason, status: 'DISMISSED', requestId, href: requestId ? `/requests/${requestId}` : undefined },
    });
  }

  async notifyUserReported(userId: string, reason: string, reportId: string, type: 'USER' | 'REQUEST', targetName?: string, targetId?: string) {
    const reasonText = this.getReasonText(reason);
    let message: string;
    let title: string;
    let href: string | undefined = undefined;
    
    if (type === 'USER') {
      title = 'Perfil denunciado';
      message = `O teu perfil foi denunciado por "${reasonText}". A denúncia será analisada pela administração.`;
      href = `/profile`; // Links to the user's own profile
    } else {
      title = 'Pedido denunciado';
      const anuncioInfo = targetName ? `pedido "${targetName}"` : 'teu pedido';
      message = `O ${anuncioInfo} foi denunciado por "${reasonText}". A denúncia será analisada pela administração.`;
      href = `/requests/${targetId}`;
    }
    
    return this.create({
      userId,
      type: 'REQUEST_STATUS_CHANGED',
      title,
      message,
      data: { 
        reportId, 
        reportReason: reason, 
        targetType: type,
        targetName,
        targetId,
        requestId: type === 'REQUEST' ? targetId : undefined,
        href,
      },
    });
  }

  async notifyReportResolved(userId: string, adminNotes: string, reportId: string, reportReason: string, action: string, requestId?: string) {
    const reasonText = this.getReasonText(reportReason);
    const adminMessage = adminNotes ? ` Nota do administrador: "${adminNotes}"` : '';
    let message = '';
    let title = '';
    
    switch (action) {
      case 'NO_ACTION':
        title = 'Denúncia analisada';
        message = `A tua denúncia por "${reasonText}" foi analisada. Nenhuma ação foi necessária.${adminMessage}`;
        break;
      case 'WARNING':
        title = 'Denúncia analisada';
        message = `A tua denúncia por "${reasonText}" foi analisada e foi enviado um aviso ao utilizador.${adminMessage}`;
        break;
      case 'BLOCK_USER':
        title = 'Denúncia resolvida';
        message = `A tua denúncia por "${reasonText}" foi analisada e o utilizador foi bloqueado.${adminMessage}`;
        break;
      case 'REMOVE_REQUEST':
        title = 'Denúncia resolvida';
        message = `A tua denúncia por "${reasonText}" foi analisada e o pedido foi removido.${adminMessage}`;
        break;
      default:
        title = 'Denúncia analisada';
        message = `A tua denúncia por "${reasonText}" foi analisada pela administração.${adminMessage}`;
    }

    return this.create({
      userId,
      type: 'REQUEST_STATUS_CHANGED',
      title,
      message,
      data: { reportId, reportReason, action, status: 'RESOLVED', requestId, href: requestId ? `/requests/${requestId}` : undefined },
    });
  }

  async notifyTargetUserReportResolved(userId: string, reportId: string, reportReason: string, adminNotes: string, requestId?: string) {
    const reasonText = this.getReasonText(reportReason);
    const adminMessage = adminNotes ? ` Nota do administrador: "${adminNotes}"` : '';

    return this.create({
      userId,
      type: 'REQUEST_STATUS_CHANGED',
      title: 'Denúncia resolvida',
      message: `A denúncia contra ti por "${reasonText}" foi resolvida pela administração. Nenhuma ação adicional foi tomada.${adminMessage}`,
      data: { reportId, reportReason, status: 'RESOLVED', requestId, href: requestId ? `/requests/${requestId}` : undefined },
    });
  }

  async notifyReportSubmitted(userId: string, reason: string, reportId: string, type: 'USER' | 'REQUEST', targetName?: string, targetId?: string) {
    const reasonText = this.getReasonText(reason);
    let message: string;
    let title: string;
    let href: string | undefined = undefined;
    
    if (type === 'USER') {
      title = 'Denúncia de perfil enviada';
      const targetInfo = targetName ? `o utilizador "${targetName}"` : 'o utilizador';
      message = `A tua denúncia contra ${targetInfo} por "${reasonText}" foi enviada e será analisada pela administração.`;
      // No href for the reporter of a user report
    } else {
      title = 'Denúncia de pedido enviada';
      const targetInfo = targetName ? `o pedido "${targetName}"` : 'o pedido';
      message = `A tua denúncia contra ${targetInfo} por "${reasonText}" foi enviada e será analisada pela administração.`;
      href = `/requests/${targetId}`;
    }
    
    return this.create({
      userId,
      type: 'REQUEST_STATUS_CHANGED',
      title,
      message,
      data: { 
        reportId, 
        reportReason: reason, 
        targetType: type, 
        targetName,
        targetId,
        requestId: type === 'REQUEST' ? targetId : undefined,
        status: 'SUBMITTED',
        href,
      },
    });
  }

  async notifyRequestRemoved(userId: string, requestId: string, adminNotes: string, reportReason: string, requestTitle?: string) {
    const reasonText = this.getReasonText(reportReason);
    const titleInfo = requestTitle ? `"${requestTitle}"` : 'pedido';
    const adminMessage = adminNotes ? ` Nota do administrador: "${adminNotes}"` : '';
    
    return this.create({
      userId,
      type: 'REQUEST_STATUS_CHANGED',
      title: 'Pedido removido',
      message: `O teu ${titleInfo} foi removido pela administração devido a uma denúncia por "${reasonText}".${adminMessage}`,
      data: { requestId, reportReason, requestTitle, action: 'REMOVED', href: `/requests/${requestId}` },
    });
  }

  async notifyUserBlocked(userId: string, reportId: string, reportReason: string, adminNotes: string) {
    const reasonText = this.getReasonText(reportReason);
    const adminMessage = adminNotes ? ` Nota do administrador: "${adminNotes}"` : '';

    return this.create({
      userId,
      type: 'USER_BLOCKED',
      title: 'Conta bloqueada',
      message: `A tua conta foi bloqueada pela administração devido a uma denúncia por "${reasonText}".${adminMessage}`,
      data: { reportId, reportReason, action: 'BLOCKED' }, // No href, as the user is blocked
    });
  }
}