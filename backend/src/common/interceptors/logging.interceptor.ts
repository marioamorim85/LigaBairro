import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CustomLoggerService } from '../logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: CustomLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const contextType = context.getType<'http' | 'graphql'>();

    if (contextType === 'graphql') {
      return this.handleGraphQLRequest(context, next, startTime);
    } else {
      return this.handleHttpRequest(context, next, startTime);
    }
  }

  private handleGraphQLRequest(
    context: ExecutionContext,
    next: CallHandler,
    startTime: number,
  ): Observable<any> {
    const gqlContext = GqlExecutionContext.create(context);
    const info = gqlContext.getInfo();
    const args = gqlContext.getArgs();
    const req = gqlContext.getContext().req;
    
    const requestId = req.headers['x-request-id'] || this.generateRequestId();
    const userId = req.user?.id;
    
    const logContext = {
      requestId,
      userId,
      operation: info.operation.operation,
      fieldName: info.fieldName,
      userAgent: req.headers['user-agent'],
      ip: req.ip || req.connection.remoteAddress,
    };

    // Log the GraphQL operation start
    this.logger.logGraphQLOperation(
      `${info.operation.operation} ${info.fieldName}`,
      args,
      logContext
    );

    return next.handle().pipe(
      tap({
        next: (result) => {
          const duration = Date.now() - startTime;
          this.logger.logResponse(`GraphQL ${info.fieldName} completed`, {
            ...logContext,
            duration,
            success: true,
            resultSize: this.getResultSize(result),
          });

          // Log performance metrics for slow queries
          if (duration > 1000) {
            this.logger.logPerformanceMetric(
              `slow_graphql_query.${info.fieldName}`,
              duration,
              'ms',
              logContext
            );
          }
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logger.error(`GraphQL ${info.fieldName} failed`, error.stack, {
            ...logContext,
            duration,
            success: false,
            errorMessage: error.message,
            errorCode: error.code,
          });
        },
      })
    );
  }

  private handleHttpRequest(
    context: ExecutionContext,
    next: CallHandler,
    startTime: number,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    const requestId = request.headers['x-request-id'] || this.generateRequestId();
    const userId = request.user?.id;
    
    const logContext = {
      requestId,
      userId,
      method: request.method,
      url: request.url,
      userAgent: request.headers['user-agent'],
      ip: request.ip,
    };

    // Log the HTTP request start
    this.logger.logRequest(`${request.method} ${request.url}`, logContext);

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          this.logger.logResponse(`${request.method} ${request.url}`, {
            ...logContext,
            statusCode: response.statusCode,
            duration,
            success: response.statusCode < 400,
          });

          // Log performance metrics for slow requests
          if (duration > 2000) {
            this.logger.logPerformanceMetric(
              'slow_http_request',
              duration,
              'ms',
              { ...logContext, statusCode: response.statusCode }
            );
          }
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logger.error(`${request.method} ${request.url} failed`, error.stack, {
            ...logContext,
            statusCode: error.status || 500,
            duration,
            success: false,
            errorMessage: error.message,
          });
        },
      })
    );
  }

  private generateRequestId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private getResultSize(result: any): number {
    if (!result) return 0;
    try {
      return JSON.stringify(result).length;
    } catch {
      return 0;
    }
  }
}