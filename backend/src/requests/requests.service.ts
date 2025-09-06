import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { GeoService } from '../common/geo/geo.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateRequestInput, UpdateRequestInput, SearchRequestsInput, RequestStatus } from './dto/request.dto';

@Injectable()
export class RequestsService {
  constructor(
    private prisma: PrismaService,
    private geoService: GeoService,
    private notificationsService: NotificationsService,
  ) {}

  async create(userId: string, input: CreateRequestInput) {
    // Validate Fiães location
    this.geoService.validateFiaesLocation(input.lat, input.lng, 'Fiães');

    return this.prisma.request.create({
      data: {
        ...input,
        city: 'Fiães', // Force Fiães for MVP
        requesterId: userId,
        scheduledFrom: input.scheduledFrom ? new Date(input.scheduledFrom) : null,
        scheduledTo: input.scheduledTo ? new Date(input.scheduledTo) : null,
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            ratingAvg: true,
          },
        },
      },
    });
  }

  async search(input: SearchRequestsInput) {
    const constraints = this.geoService.getOperationalConstraints();
    
    // Build where clause
    const where: any = {
      city: constraints.city, // Force Fiães
      AND: [
        {
          // Use raw SQL for distance filtering
          lat: {
            gte: constraints.centerLat - (constraints.radiusKm / 111.32), // Rough latitude degree conversion
            lte: constraints.centerLat + (constraints.radiusKm / 111.32),
          },
        },
        {
          lng: {
            gte: constraints.centerLng - (constraints.radiusKm / (111.32 * Math.cos(constraints.centerLat * Math.PI / 180))),
            lte: constraints.centerLng + (constraints.radiusKm / (111.32 * Math.cos(constraints.centerLat * Math.PI / 180))),
          },
        },
      ],
    };

    if (input.category) {
      where.category = input.category;
    }

    if (input.status) {
      where.status = input.status;
    }
    // If status is null, don't filter by status (show all)

    const requests = await this.prisma.request.findMany({
      where,
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            ratingAvg: true,
          },
        },
        applications: {
          select: {
            id: true,
            status: true,
            helper: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: [
        { createdAt: 'desc' },
      ],
      take: input.limit,
      skip: input.offset,
    });

    // Calculate distances and add to results
    return requests.map(request => ({
      ...request,
      distance: this.geoService.calculateDistance(
        constraints.centerLat,
        constraints.centerLng,
        request.lat,
        request.lng
      ),
    })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }

  async findById(id: string) {
    console.log('🔍 Finding request by ID:', id);
    
    const result = await this.prisma.request.findUnique({
      where: { id },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            ratingAvg: true,
          },
        },
        applications: {
          include: {
            helper: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
                ratingAvg: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        messages: {
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
        },
      },
    });
    
    console.log('🔍 Request found:', !!result);
    if (result) {
      console.log('🔍 Applications count:', result.applications?.length || 0);
      console.log('🔍 Applications details:', result.applications?.map(app => ({
        id: app.id,
        helperId: app.helperId,
        status: app.status
      })) || []);
    }
    
    return result;
  }

  async update(id: string, input: UpdateRequestInput, userId: string) {
    // Verify user owns the request
    const request = await this.prisma.request.findUnique({
      where: { id },
    });

    if (!request) {
      throw new BadRequestException('Pedido não encontrado');
    }

    if (request.requesterId !== userId) {
      throw new BadRequestException('Apenas o autor do pedido pode alterar este pedido');
    }

    // Build update data
    const updateData: any = {
      ...input,
      scheduledFrom: input.scheduledFrom ? new Date(input.scheduledFrom) : undefined,
      scheduledTo: input.scheduledTo ? new Date(input.scheduledTo) : undefined,
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    return this.prisma.request.update({
      where: { id },
      data: updateData,
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            ratingAvg: true,
          },
        },
        applications: {
          include: {
            helper: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
                ratingAvg: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  async updateStatus(id: string, status: RequestStatus, userId: string) {
    // Verify user owns the request
    const request = await this.prisma.request.findUnique({
      where: { id },
    });

    if (!request) {
      throw new BadRequestException('Pedido não encontrado');
    }

    if (request.requesterId !== userId) {
      throw new BadRequestException('Apenas o autor do pedido pode alterar o estado');
    }

    const updatedRequest = await this.prisma.request.update({
      where: { id },
      data: { status },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        applications: {
          where: { status: 'ACCEPTED' },
          include: {
            helper: {
              select: { id: true },
            },
          },
        },
      },
    });

    // Notify accepted helper about status change
    const acceptedHelper = updatedRequest.applications.find(app => app.status === 'ACCEPTED');
    if (acceptedHelper && status !== 'OPEN') {
      await this.notificationsService.notifyRequestStatusChanged(
        acceptedHelper.helper.id,
        updatedRequest.title,
        status,
        updatedRequest.id,
      );
    }

    return updatedRequest;
  }
}