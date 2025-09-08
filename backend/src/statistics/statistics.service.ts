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
  monthlyGrowth: {
    users: number;
    requests: number;
  };
  userActivity: {
    activeToday: number;
    activeThisWeek: number;
  };
  recentActivity: {
    newUsers: number;
    newRequests: number;
    newApplications: number;
  };
}

export interface UserManagement {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  totalRequests: number;
  totalApplications: number;
  averageRating?: number;
  isActive: boolean;
}

export interface ActivityReport {
  date: string;
  newUsers: number;
  newRequests: number;
  newApplications: number;
  completedRequests: number;
  totalMessages: number;
}

@Injectable()
export class StatisticsService {
  constructor(private prisma: PrismaService) {}

  async getAdminStats(): Promise<AdminStats> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));

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
      monthlyUsers,
      monthlyRequests,
      activeToday,
      activeThisWeek,
      newUsersToday,
      newRequestsToday,
      newApplicationsToday,
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
      
      // Monthly growth - users
      this.prisma.user.count({
        where: {
          createdAt: {
            gte: startOfMonth,
          },
        },
      }),
      
      // Monthly growth - requests
      this.prisma.request.count({
        where: {
          createdAt: {
            gte: startOfMonth,
          },
        },
      }),
      
      // Active users today (created messages/requests today)
      this.prisma.user.count({
        where: {
          OR: [
            {
              messages: {
                some: {
                  createdAt: {
                    gte: startOfToday,
                  },
                },
              },
            },
            {
              requests: {
                some: {
                  createdAt: {
                    gte: startOfToday,
                  },
                },
              },
            },
          ],
        },
      }),
      
      // Active users this week
      this.prisma.user.count({
        where: {
          OR: [
            {
              messages: {
                some: {
                  createdAt: {
                    gte: startOfWeek,
                  },
                },
              },
            },
            {
              requests: {
                some: {
                  createdAt: {
                    gte: startOfWeek,
                  },
                },
              },
            },
          ],
        },
      }),
      
      // New users today
      this.prisma.user.count({
        where: {
          createdAt: {
            gte: startOfToday,
          },
        },
      }),
      
      // New requests today
      this.prisma.request.count({
        where: {
          createdAt: {
            gte: startOfToday,
          },
        },
      }),
      
      // New applications today
      this.prisma.application.count({
        where: {
          createdAt: {
            gte: startOfToday,
          },
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
      monthlyGrowth: {
        users: monthlyUsers,
        requests: monthlyRequests,
      },
      userActivity: {
        activeToday,
        activeThisWeek,
      },
      recentActivity: {
        newUsers: newUsersToday,
        newRequests: newRequestsToday,
        newApplications: newApplicationsToday,
      },
    };
  }

  async getUsersForManagement(): Promise<UserManagement[]> {
    const users = await this.prisma.user.findMany({
      include: {
        requests: {
          select: { id: true },
        },
        applications: {
          select: { id: true },
        },
        reviewsRecv: {
          select: { rating: true },
        },
      },
    });

    return users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      totalRequests: user.requests.length,
      totalApplications: user.applications.length,
      averageRating: user.reviewsRecv.length > 0 
        ? Number((user.reviewsRecv.reduce((sum, review) => sum + review.rating, 0) / user.reviewsRecv.length).toFixed(1))
        : undefined,
      isActive: user.isActive,
    }));
  }

  async getActivityReport(days: number = 30): Promise<ActivityReport[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const reports: ActivityReport[] = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const [newUsers, newRequests, newApplications, completedRequests, totalMessages] = await Promise.all([
        this.prisma.user.count({
          where: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        }),
        this.prisma.request.count({
          where: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        }),
        this.prisma.application.count({
          where: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        }),
        this.prisma.request.count({
          where: {
            status: 'DONE',
            updatedAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        }),
        this.prisma.message.count({
          where: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        }),
      ]);

      reports.push({
        date: startOfDay.toISOString().split('T')[0],
        newUsers,
        newRequests,
        newApplications,
        completedRequests,
        totalMessages,
      });
    }

    return reports.reverse();
  }

  async toggleUserStatus(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { isActive: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
    });

    return true;
  }

  async updateUserRole(userId: string, newRole: 'USER' | 'ADMIN'): Promise<boolean> {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // If trying to remove admin role, check if there's at least one other admin
    if (user.role === 'ADMIN' && newRole === 'USER') {
      const adminCount = await this.prisma.user.count({
        where: { role: 'ADMIN' },
      });

      if (adminCount <= 1) {
        throw new Error('Cannot remove the last admin user');
      }
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    return true;
  }

  async deleteUser(userId: string): Promise<boolean> {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // If trying to delete an admin, check if there's at least one other admin
    if (user.role === 'ADMIN') {
      const adminCount = await this.prisma.user.count({
        where: { role: 'ADMIN' },
      });

      if (adminCount <= 1) {
        throw new Error('Cannot delete the last admin user');
      }
    }

    // Delete user (this will cascade delete related records)
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return true;
  }
}