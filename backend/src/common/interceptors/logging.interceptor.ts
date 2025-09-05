import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const isGraphQL = context.getType<string>() === 'graphql';

    if (isGraphQL) {
      const gqlContext = GqlExecutionContext.create(context);
      const info = gqlContext.getInfo();
      const operation = info.operation.operation;
      const fieldName = info.fieldName;

      return next.handle().pipe(
        tap(() => {
          const elapsed = Date.now() - now;
          this.logger.log(
            `GraphQL ${operation.toUpperCase()} ${fieldName} - ${elapsed}ms`,
          );
        }),
      );
    } else {
      const request = context.switchToHttp().getRequest();
      const method = request.method;
      const url = request.url;

      return next.handle().pipe(
        tap(() => {
          const elapsed = Date.now() - now;
          this.logger.log(`${method} ${url} - ${elapsed}ms`);
        }),
      );
    }
  }
}