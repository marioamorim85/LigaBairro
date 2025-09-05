import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { SendMessageInput } from './dto/message.dto';

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async send(userId: string, input: SendMessageInput) {
    // Verify user has access to this request (requester, accepted helper, or applicant on open requests)
    const request = await this.prisma.request.findUnique({
      where: { id: input.requestId },
      include: {
        applications: {
          where: {
            OR: [
              { status: 'ACCEPTED', helperId: userId },
              { status: 'APPLIED', helperId: userId },
            ],
          },
        },
      },
    });

    if (!request) {
      throw new BadRequestException('Pedido não encontrado');
    }

    const isRequester = request.requesterId === userId;
    const isAcceptedHelper = request.applications.some(app => app.status === 'ACCEPTED');
    const hasApplied = request.applications.some(app => app.helperId === userId);
    const isOpenRequest = request.status === 'OPEN';

    // Allow chat if: owner, accepted helper, applicant, or anyone on open requests
    if (!isRequester && !isAcceptedHelper && !hasApplied && !isOpenRequest) {
      throw new BadRequestException('Não tem permissão para enviar mensagens neste pedido');
    }

    const message = await this.prisma.message.create({
      data: {
        requestId: input.requestId,
        senderId: userId,
        text: input.text,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Get participants to notify (exclude sender)
    const participantIds = new Set<string>();
    
    // 1. Always add request owner (unless they sent the message)
    if (request.requesterId !== userId) {
      participantIds.add(request.requesterId);
    }
    
    // 2. Add accepted helper (unless they sent the message)
    const acceptedHelper = request.applications.find(app => app.status === 'ACCEPTED');
    if (acceptedHelper && acceptedHelper.helperId !== userId) {
      participantIds.add(acceptedHelper.helperId);
    }
    
    // 3. Add ALL applicants - they're part of the conversation once they apply
    request.applications.forEach(app => {
      if (app.helperId !== userId) {
        participantIds.add(app.helperId);
      }
    });
    
    // 4. Add anyone who has previously participated in the conversation
    // This ensures that anyone who wrote a message before continues to get notifications
    const previousMessageSenders = await this.prisma.message.findMany({
      where: { requestId: input.requestId },
      select: { senderId: true },
      distinct: ['senderId'],
    });
    
    previousMessageSenders.forEach(msg => {
      if (msg.senderId !== userId) {
        participantIds.add(msg.senderId);
      }
    });

    // Send notifications to participants
    await Promise.all(
      Array.from(participantIds).map(participantId =>
        this.notificationsService.notifyNewMessage(
          participantId,
          message.sender.name,
          request.title,
          request.id,
        ),
      ),
    );

    return message;
  }

  async findByRequest(requestId: string, userId: string) {
    // Verify user has access to this request
    const request = await this.prisma.request.findUnique({
      where: { id: requestId },
      include: {
        applications: {
          where: {
            OR: [
              { status: 'ACCEPTED', helperId: userId },
              { status: 'APPLIED', helperId: userId },
            ],
          },
        },
      },
    });

    if (!request) {
      throw new BadRequestException('Pedido não encontrado');
    }

    const isRequester = request.requesterId === userId;
    const isAcceptedHelper = request.applications.some(app => app.status === 'ACCEPTED');
    const hasApplied = request.applications.some(app => app.helperId === userId);
    const isOpenRequest = request.status === 'OPEN';

    // Allow reading messages if: owner, accepted helper, applicant, or anyone on open requests
    if (!isRequester && !isAcceptedHelper && !hasApplied && !isOpenRequest) {
      throw new BadRequestException('Não tem permissão para ver mensagens deste pedido');
    }

    return this.prisma.message.findMany({
      where: { requestId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}