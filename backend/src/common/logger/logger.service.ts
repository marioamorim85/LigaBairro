import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';

export interface LogContext {
  userId?: string;
  requestId?: string;
  operation?: string;
  service?: string;
  method?: string;
  duration?: number;
  statusCode?: number;
  userAgent?: string;
  ip?: string;
  [key: string]: any;
}

@Injectable()
export class CustomLoggerService implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    const isProduction = process.env.NODE_ENV === 'production';
    
    this.logger = winston.createLogger({
      level: isProduction ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        isProduction 
          ? winston.format.json()
          : winston.format.combine(
              winston.format.colorize(),
              winston.format.printf(({ timestamp, level, message, ...meta }) => {
                const metaStr = Object.keys(meta).length > 0 
                  ? `\n${JSON.stringify(meta, null, 2)}` 
                  : '';
                return `${timestamp} [${level}]: ${message}${metaStr}`;
              })
            )
      ),
      transports: [
        new winston.transports.Console(),
        ...(isProduction 
          ? [
              new winston.transports.File({ 
                filename: 'logs/error.log', 
                level: 'error',
                maxsize: 5242880, // 5MB
                maxFiles: 5,
              }),
              new winston.transports.File({ 
                filename: 'logs/combined.log',
                maxsize: 5242880, // 5MB
                maxFiles: 10,
              })
            ]
          : []
        )
      ],
    });
  }

  log(message: string, context?: LogContext) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: LogContext) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: LogContext) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: LogContext) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: LogContext) {
    this.logger.verbose(message, { context });
  }

  // Specific logging methods for common scenarios
  logRequest(message: string, context: LogContext) {
    this.log(`[REQUEST] ${message}`, {
      ...context,
      type: 'request'
    });
  }

  logResponse(message: string, context: LogContext) {
    this.log(`[RESPONSE] ${message}`, {
      ...context,
      type: 'response'
    });
  }

  logGraphQLOperation(operationName: string, variables: any, context: LogContext) {
    this.debug(`[GRAPHQL] ${operationName}`, {
      ...context,
      type: 'graphql',
      operationName,
      variables: this.sanitizeVariables(variables)
    });
  }

  logDatabaseQuery(query: string, duration: number, context: LogContext) {
    this.debug(`[DATABASE] Query executed`, {
      ...context,
      type: 'database',
      query: query.substring(0, 200) + (query.length > 200 ? '...' : ''),
      duration
    });
  }

  logUserAction(action: string, userId: string, context: LogContext) {
    this.log(`[USER_ACTION] ${action}`, {
      ...context,
      type: 'user_action',
      userId,
      action
    });
  }

  logSecurityEvent(event: string, severity: 'low' | 'medium' | 'high' | 'critical', context: LogContext) {
    const logLevel = severity === 'critical' || severity === 'high' ? 'error' : 'warn';
    this.logger[logLevel](`[SECURITY] ${event}`, {
      ...context,
      type: 'security',
      severity,
      event
    });
  }

  logPerformanceMetric(metric: string, value: number, unit: string, context: LogContext) {
    this.log(`[PERFORMANCE] ${metric}: ${value}${unit}`, {
      ...context,
      type: 'performance',
      metric,
      value,
      unit
    });
  }

  private sanitizeVariables(variables: any): any {
    if (!variables) return variables;
    
    const sanitized = { ...variables };
    const sensitiveFields = ['password', 'token', 'secret', 'authorization', 'cookie'];
    
    const sanitizeObj = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) return obj;
      
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        const isSensitive = sensitiveFields.some(field => 
          key.toLowerCase().includes(field)
        );
        
        if (isSensitive) {
          result[key] = '[REDACTED]';
        } else if (typeof value === 'object') {
          result[key] = sanitizeObj(value);
        } else {
          result[key] = value;
        }
      }
      return result;
    };
    
    return sanitizeObj(sanitized);
  }
}