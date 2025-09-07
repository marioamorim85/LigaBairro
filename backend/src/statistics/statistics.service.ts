import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

export interface AdminStats {
  totalUsers: number;
  totalRequests: number;
  activeRequests: number;
  completedRequests: number;
  totalApplications: number;
  totalMessages: number;
  pendingReports: number;
  todayMessages: number;
  averageRating: number;
  topCategories: { category: string; count: number }[];
}

@Injectable()
export class StatisticsService {
  constructor(private prisma: PrismaService) {}

  async getAdminStats(): Promise<AdminStats> {
    const [
      totalUsers,
      totalRequests,
      activeRequests,
      completedRequests,
      totalApplications,
      totalMessages,
      pendingReports,
      todayMessages,
      topCategories,
      avgRating,
    ] = await Promise.all([
      // Total users
      this.prisma.user.count(),
      
      // Total requests
      this.prisma.request.count(),
      
      // Active requests (OPEN + IN_PROGRESS)
      this.prisma.request.count({
        where: {
          status: {
            in: ['OPEN', 'IN_PROGRESS'],
          },
        },
      }),
      
      // Completed requests
      this.prisma.request.count({
        where: {
          status: 'DONE',
        },
      }),
      
      // Total applications
      this.prisma.application.count(),
      
      // Total messages
      this.prisma.message.count(),
      
      // Pending reports
      this.prisma.report.count({
        where: {
          status: 'PENDING',
        },
      }),
      
      // Today's messages
      this.prisma.message.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      
      // Top categories
      this.prisma.request.groupBy({
        by: ['category'],
        _count: {
          category: true,
        },
        orderBy: {
          _count: {
            category: 'desc',
          },
        },
        take: 5,
      }),
      
      // Average rating
      this.prisma.review.aggregate({
        _avg: {
          rating: true,
        },
      }),
    ]);

    return {
      totalUsers,
      totalRequests,
      activeRequests,
      completedRequests,
      totalApplications,
      totalMessages,
      pendingReports,
      todayMessages,
      averageRating: Number(avgRating._avg.rating?.toFixed(1)) || 0,
      topCategories: topCategories.map(cat => ({
        category: cat.category,
        count: cat._count.category,
      })),
    };
  }
}