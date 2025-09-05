import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    // Check if it's a GraphQL context
    if (host.getType<string>() === 'graphql') {
      // Let GraphQL handle the error formatting
      throw exception;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request?.url || 'unknown',
      message: exception.message,
    };

    this.logger.error(
      `${request?.method || 'UNKNOWN'} ${request?.url || 'unknown'}`,
      exception.stack,
      'HttpExceptionFilter',
    );

    response.status(status).json(errorResponse);
  }
}

@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  private readonly logger = new Logger(GraphQLExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const info = gqlHost.getInfo();
    const context = gqlHost.getContext();

    this.logger.error(
      `GraphQL Error in ${info.fieldName}`,
      exception.stack,
      'GraphQLExceptionFilter',
    );

    // Let GraphQL handle the error formatting
    throw exception;
  }
}