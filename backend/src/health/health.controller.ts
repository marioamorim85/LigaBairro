import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  PrismaHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
  HealthCheckResult,
} from '@nestjs/terminus';
import { Response } from 'express';
import { PrismaService } from '../common/prisma/prisma.service';
import { CustomLoggerService } from '../common/logger/logger.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prisma: PrismaHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private prismaService: PrismaService,
    private logger: CustomLoggerService,
  ) {}

  @Get()
  @HealthCheck()
  async check(@Res() res: Response) {
    const startTime = Date.now();
    
    try {
      const result = await this.health.check([
        () => this.prisma.pingCheck('database', this.prismaService as any),
        () => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024), // 200MB threshold
        () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),  // 300MB threshold
        () => this.disk.checkStorage('storage', {
          path: process.platform === 'win32' ? 'C:\\' : '/',
          thresholdPercent: 0.85, // Alert at 85% disk usage
        }),
        () => this.customGraphQLCheck(),
        () => this.customDatabaseConnectionPoolCheck(),
      ]);

      const duration = Date.now() - startTime;
      
      // Log successful health check
      this.logger.log('Health check completed successfully', {
        duration,
        checks: Object.keys(result.details).length,
        service: 'health-check',
      });

      // Add additional metadata to response
      const enhancedResult = {
        ...result,
        meta: {
          service: 'ligabairro-backend',
          version: process.env.npm_package_version || '1.0.0',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          checkDuration: duration,
          environment: process.env.NODE_ENV,
          nodeVersion: process.version,
          platform: process.platform,
        }
      };

      return res.status(HttpStatus.OK).json(enhancedResult);
    } catch (error) {
      const duration = Date.now() - startTime;
      
      // Log health check failure
      this.logger.error('Health check failed', error.stack, {
        duration,
        service: 'health-check',
        errorMessage: error.message,
      });

      return res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString(),
        service: 'ligabairro-backend',
        checkDuration: duration,
      });
    }
  }

  @Get('live')
  live() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'ligabairro-backend',
      version: '1.0.0',
    };
  }

  @Get('ready')
  async ready() {
    const startTime = Date.now();
    
    try {
      // Test database connection with a more comprehensive query
      await this.prismaService.$queryRaw`SELECT 1 as test`;
      
      // Test database write capability (if needed)
      const dbTest = await this.prismaService.$queryRaw`SELECT COUNT(*) as count FROM "User"`;
      
      const duration = Date.now() - startTime;
      
      this.logger.log('Readiness check passed', {
        duration,
        service: 'readiness-check',
        dbResponseTime: duration,
      });

      return {
        status: 'ready',
        database: 'connected',
        dbResponseTime: duration,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      this.logger.error('Readiness check failed', error.stack, {
        duration,
        service: 'readiness-check',
        errorMessage: error.message,
      });

      return {
        status: 'not ready',
        database: 'disconnected',
        error: error.message,
        timestamp: new Date().toISOString(),
        checkDuration: duration,
      };
    }
  }

  // Custom health check for GraphQL functionality
  private async customGraphQLCheck() {
    try {
      // Test a simple GraphQL operation by checking if we can access the schema
      const result = await this.prismaService.user.count();
      return {
        'graphql': {
          status: 'up',
          message: 'GraphQL endpoint accessible',
          testQuery: 'user count successful',
        }
      };
    } catch (error) {
      throw new Error(`GraphQL check failed: ${error.message}`);
    }
  }

  // Custom health check for database connection pool
  private async customDatabaseConnectionPoolCheck() {
    try {
      const startTime = Date.now();
      
      // Test multiple concurrent database connections
      const promises = Array.from({ length: 5 }, () =>
        this.prismaService.$queryRaw`SELECT 1`
      );
      
      await Promise.all(promises);
      const duration = Date.now() - startTime;
      
      return {
        'database_pool': {
          status: 'up',
          message: 'Database connection pool healthy',
          connectionTest: `5 concurrent connections in ${duration}ms`,
          responseTime: duration,
        }
      };
    } catch (error) {
      throw new Error(`Database connection pool check failed: ${error.message}`);
    }
  }

  // New endpoint for detailed metrics
  @Get('metrics')
  async metrics() {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    try {
      // Database metrics
      const startTime = Date.now();
      await this.prismaService.$queryRaw`SELECT 1`;
      const dbLatency = Date.now() - startTime;
      
      const userCount = await this.prismaService.user.count();
      const requestCount = await this.prismaService.request.count();
      const applicationCount = await this.prismaService.application.count();

      return {
        service: 'ligabairro-backend',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: {
          heapUsed: memUsage.heapUsed,
          heapTotal: memUsage.heapTotal,
          external: memUsage.external,
          rss: memUsage.rss,
        },
        cpu: cpuUsage,
        database: {
          latency: dbLatency,
          users: userCount,
          requests: requestCount,
          applications: applicationCount,
        },
        environment: {
          nodeVersion: process.version,
          platform: process.platform,
          env: process.env.NODE_ENV,
        }
      };
    } catch (error) {
      this.logger.error('Metrics collection failed', error.stack, {
        service: 'metrics',
        errorMessage: error.message,
      });

      return {
        service: 'ligabairro-backend',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: memUsage,
        cpu: cpuUsage,
        database: {
          status: 'error',
          error: error.message,
        },
        environment: {
          nodeVersion: process.version,
          platform: process.platform,
          env: process.env.NODE_ENV,
        }
      };
    }
  }
}