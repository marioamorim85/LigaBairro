import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DataLoaderService {
  constructor(private prisma: PrismaService) {}

  // DataLoader for Users by ID
  private readonly userLoader = new DataLoader<string, any>(
    async (userIds: readonly string[]) => {
      const users = await this.prisma.user.findMany({
        where: { id: { in: [...userIds] } },
        include: {
          _count: {
            select: {
              requests: true,
              applications: true,
              reviewsRecv: true,
            }
          }
        }
      });

      // Map results to maintain order
      const userMap = new Map(users.map(user => [user.id, user]));
      return userIds.map(id => userMap.get(id) || null);
    },
    {
      cache: true,
      maxBatchSize: 100,
    }
  );

  // DataLoader for Requests by ID
  private readonly requestLoader = new DataLoader<string, any>(
    async (requestIds: readonly string[]) => {
      const requests = await this.prisma.request.findMany({
        where: { id: { in: [...requestIds] } },
        include: {
          requester: true,
          applications: {
            include: {
              helper: true,
            }
          },
          _count: {
            select: {
              applications: true,
              messages: true,
            }
          }
        }
      });

      const requestMap = new Map(requests.map(request => [request.id, request]));
      return requestIds.map(id => requestMap.get(id) || null);
    },
    {
      cache: true,
      maxBatchSize: 50,
    }
  );

  // DataLoader for Applications by Request ID
  private readonly applicationsByRequestLoader = new DataLoader<string, any[]>(
    async (requestIds: readonly string[]) => {
      const applications = await this.prisma.application.findMany({
        where: { requestId: { in: [...requestIds] } },
        include: {
          helper: {
            include: {
              _count: {
                select: {
                  reviewsRecv: true,
                }
              }
            }
          },
          request: true,
        }
      });

      // Group applications by requestId
      const applicationsMap = new Map<string, any[]>();
      
      applications.forEach(application => {
        const requestId = application.requestId;
        if (!applicationsMap.has(requestId)) {
          applicationsMap.set(requestId, []);
        }
        applicationsMap.get(requestId)!.push(application);
      });

      return requestIds.map(id => applicationsMap.get(id) || []);
    },
    {
      cache: true,
      maxBatchSize: 50,
    }
  );

  // DataLoader for Reviews by User ID
  private readonly reviewsByUserLoader = new DataLoader<string, any[]>(
    async (userIds: readonly string[]) => {
      const reviews = await this.prisma.review.findMany({
        where: { revieweeId: { in: [...userIds] } },
        include: {
          reviewer: true,
          request: {
            select: {
              title: true,
              category: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
      });

      // Group reviews by reviewedId
      const reviewsMap = new Map<string, any[]>();
      
      reviews.forEach(review => {
        const userId = review.revieweeId;
        if (!reviewsMap.has(userId)) {
          reviewsMap.set(userId, []);
        }
        reviewsMap.get(userId)!.push(review);
      });

      return userIds.map(id => reviewsMap.get(id) || []);
    },
    {
      cache: true,
      maxBatchSize: 50,
    }
  );

  // DataLoader for Messages by Request ID
  private readonly messagesByRequestLoader = new DataLoader<string, any[]>(
    async (requestIds: readonly string[]) => {
      const messages = await this.prisma.message.findMany({
        where: { requestId: { in: [...requestIds] } },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
            }
          }
        },
        orderBy: { createdAt: 'asc' },
      });

      // Group messages by requestId
      const messagesMap = new Map<string, any[]>();
      
      messages.forEach(message => {
        const requestId = message.requestId;
        if (!messagesMap.has(requestId)) {
          messagesMap.set(requestId, []);
        }
        messagesMap.get(requestId)!.push(message);
      });

      return requestIds.map(id => messagesMap.get(id) || []);
    },
    {
      cache: true,
      maxBatchSize: 50,
    }
  );

  // Public methods to access DataLoaders
  getUserById(id: string) {
    return this.userLoader.load(id);
  }

  getRequestById(id: string) {
    return this.requestLoader.load(id);
  }

  getApplicationsByRequestId(requestId: string) {
    return this.applicationsByRequestLoader.load(requestId);
  }

  getReviewsByUserId(userId: string) {
    return this.reviewsByUserLoader.load(userId);
  }

  getMessagesByRequestId(requestId: string) {
    return this.messagesByRequestLoader.load(requestId);
  }

  // Clear cache methods for real-time updates
  clearUserCache(id: string) {
    this.userLoader.clear(id);
  }

  clearRequestCache(id: string) {
    this.requestLoader.clear(id);
    this.applicationsByRequestLoader.clear(id);
    this.messagesByRequestLoader.clear(id);
  }

  clearApplicationCache(requestId: string) {
    this.applicationsByRequestLoader.clear(requestId);
  }

  clearReviewCache(userId: string) {
    this.reviewsByUserLoader.clear(userId);
  }

  clearMessageCache(requestId: string) {
    this.messagesByRequestLoader.clear(requestId);
  }

  // Clear all caches
  clearAll() {
    this.userLoader.clearAll();
    this.requestLoader.clearAll();
    this.applicationsByRequestLoader.clearAll();
    this.reviewsByUserLoader.clearAll();
    this.messagesByRequestLoader.clearAll();
  }
}