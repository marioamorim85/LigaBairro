"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const gql_auth_guard_1 = require("../auth/guards/gql-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const requests_service_1 = require("./requests.service");
const request_dto_1 = require("./dto/request.dto");
const prisma_service_1 = require("../common/prisma/prisma.service");
let RequestsResolver = class RequestsResolver {
    constructor(requestsService, prismaService) {
        this.requestsService = requestsService;
        this.prismaService = prismaService;
    }
    createRequest(user, input) {
        return this.requestsService.create(user.id, input);
    }
    searchRequests(input) {
        return this.requestsService.search(input);
    }
    request(id) {
        return this.requestsService.findById(id);
    }
    updateRequest(user, id, input) {
        return this.requestsService.update(id, input, user.id);
    }
    updateRequestStatus(user, id, status) {
        return this.requestsService.updateStatus(id, status, user.id);
    }
    async requester(request) {
        return this.prismaService.user.findUnique({
            where: { id: request.requesterId },
        });
    }
    async applications(request) {
        return this.prismaService.application.findMany({
            where: { requestId: request.id },
            include: {
                helper: true,
            },
        });
    }
    async messages(request) {
        return this.prismaService.message.findMany({
            where: { requestId: request.id },
            include: {
                sender: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
    }
};
exports.RequestsResolver = RequestsResolver;
__decorate([
    (0, graphql_1.Mutation)(() => request_dto_1.Request),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_dto_1.CreateRequestInput]),
    __metadata("design:returntype", void 0)
], RequestsResolver.prototype, "createRequest", null);
__decorate([
    (0, graphql_1.Query)(() => [request_dto_1.Request]),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_dto_1.SearchRequestsInput]),
    __metadata("design:returntype", void 0)
], RequestsResolver.prototype, "searchRequests", null);
__decorate([
    (0, graphql_1.Query)(() => request_dto_1.Request, { nullable: true }),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RequestsResolver.prototype, "request", null);
__decorate([
    (0, graphql_1.Mutation)(() => request_dto_1.Request),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id')),
    __param(2, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, request_dto_1.UpdateRequestInput]),
    __metadata("design:returntype", void 0)
], RequestsResolver.prototype, "updateRequest", null);
__decorate([
    (0, graphql_1.Mutation)(() => request_dto_1.Request),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id')),
    __param(2, (0, graphql_1.Args)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], RequestsResolver.prototype, "updateRequestStatus", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_dto_1.Request]),
    __metadata("design:returntype", Promise)
], RequestsResolver.prototype, "requester", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_dto_1.Request]),
    __metadata("design:returntype", Promise)
], RequestsResolver.prototype, "applications", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_dto_1.Request]),
    __metadata("design:returntype", Promise)
], RequestsResolver.prototype, "messages", null);
exports.RequestsResolver = RequestsResolver = __decorate([
    (0, graphql_1.Resolver)(() => request_dto_1.Request),
    __metadata("design:paramtypes", [requests_service_1.RequestsService,
        prisma_service_1.PrismaService])
], RequestsResolver);
//# sourceMappingURL=requests.resolver.js.map