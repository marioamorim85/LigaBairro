import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
export declare class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: HttpException, host: ArgumentsHost): void;
}
export declare class GraphQLExceptionFilter implements GqlExceptionFilter {
    private readonly logger;
    catch(exception: any, host: ArgumentsHost): void;
}
