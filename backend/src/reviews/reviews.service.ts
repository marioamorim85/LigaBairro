import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ReviewsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(reviewerId: string, requestId: string, revieweeId: string, rating: number, comment?: string) {
    // Verify request is completed
    const request = await this.prisma.request.findUnique({
      where: { id: requestId },
      include: {
        applications: {
          where: { status: 'ACCEPTED' },
        },
      },
    });

    if (!request) {
      throw new BadRequestException('Pedido não encontrado');
    }

    if (request.status !== 'DONE') {
      throw new BadRequestException('Apenas pedidos concluídos podem ser avaliados');
    }

    // Verify reviewer has permission
    const isRequester = request.requesterId === reviewerId;
    const acceptedApplication = request.applications[0];
    const isAcceptedHelper = acceptedApplication?.helperId === reviewerId;

    if (!isRequester && !isAcceptedHelper) {
      throw new BadRequestException('Não tem permissão para avaliar este pedido');
    }

    // Check if review already exists
    const existingReview = await this.prisma.review.findFirst({
      where: {
        requestId,
        reviewerId,
        revieweeId,
      },
    });

    if (existingReview) {
      throw new BadRequestException('Já avaliou este utilizador para este pedido');
    }

    const review = await this.prisma.review.create({
      data: {
        requestId,
        reviewerId,
        revieweeId,
        rating,
        comment,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        reviewee: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Update user's average rating
    await this.updateUserRating(revieweeId);

    // Send notification to reviewee
    await this.notificationsService.notifyNewReview(
      revieweeId,
      review.reviewer.name,
      rating,
      request.title,
      request.id,
    );

    return review;
  }

  async findByUser(userId: string, limit: number = 10) {
    return this.prisma.review.findMany({
      where: { revieweeId: userId },
      include: {
        reviewer: {
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
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getUserStats(userId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { revieweeId: userId },
    });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;

    const ratingDistribution = {
      rating5: reviews.filter(r => r.rating === 5).length,
      rating4: reviews.filter(r => r.rating === 4).length,
      rating3: reviews.filter(r => r.rating === 3).length,
      rating2: reviews.filter(r => r.rating === 2).length,
      rating1: reviews.filter(r => r.rating === 1).length,
    };

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 100) / 100,
      ratingDistribution,
    };
  }

  async canReview(reviewerId: string, requestId: string, revieweeId: string): Promise<boolean> {
    const request = await this.prisma.request.findUnique({
      where: { id: requestId },
      include: {
        applications: {
          where: { status: 'ACCEPTED' },
        },
      },
    });

    if (!request || request.status !== 'DONE') {
      return false;
    }

    const isRequester = request.requesterId === reviewerId;
    const acceptedApplication = request.applications[0];
    const isAcceptedHelper = acceptedApplication?.helperId === reviewerId;

    if (!isRequester && !isAcceptedHelper) {
      return false;
    }

    // Check if review already exists
    const existingReview = await this.prisma.review.findFirst({
      where: {
        requestId,
        reviewerId,
        revieweeId,
      },
    });

    return !existingReview;
  }

  private async updateUserRating(userId: string) {
    const avgResult = await this.prisma.review.aggregate({
      where: { revieweeId: userId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    const avgRating = avgResult._avg.rating || 0;
    const roundedRating = Math.round(avgRating * 100) / 100;

    await this.prisma.user.update({
      where: { id: userId },
      data: { ratingAvg: roundedRating },
    });
  }
}