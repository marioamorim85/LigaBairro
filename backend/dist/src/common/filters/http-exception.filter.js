"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HttpExceptionFilter_1, GraphQLExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLExceptionFilter = exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(HttpExceptionFilter_1.name);
    }
    catch(exception, host) {
        if (host.getType() === 'graphql') {
            throw exception;
        }
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: (request === null || request === void 0 ? void 0 : request.url) || 'unknown',
            message: exception.message,
        };
        this.logger.error(`${(request === null || request === void 0 ? void 0 : request.method) || 'UNKNOWN'} ${(request === null || request === void 0 ? void 0 : request.url) || 'unknown'}`, exception.stack, 'HttpExceptionFilter');
        response.status(status).json(errorResponse);
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(common_1.HttpException)
], HttpExceptionFilter);
let GraphQLExceptionFilter = GraphQLExceptionFilter_1 = class GraphQLExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(GraphQLExceptionFilter_1.name);
    }
    catch(exception, host) {
        const gqlHost = graphql_1.GqlArgumentsHost.create(host);
        const info = gqlHost.getInfo();
        const context = gqlHost.getContext();
        this.logger.error(`GraphQL Error in ${info.fieldName}`, exception.stack, 'GraphQLExceptionFilter');
        throw exception;
    }
};
exports.GraphQLExceptionFilter = GraphQLExceptionFilter;
exports.GraphQLExceptionFilter = GraphQLExceptionFilter = GraphQLExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], GraphQLExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map