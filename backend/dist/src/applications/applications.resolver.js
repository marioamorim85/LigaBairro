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
exports.ApplicationsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const gql_auth_guard_1 = require("../auth/guards/gql-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const applications_service_1 = require("./applications.service");
const messages_gateway_1 = require("../messages/messages.gateway");
const application_dto_1 = require("./dto/application.dto");
const prisma_service_1 = require("../common/prisma/prisma.service");
let ApplicationsResolver = class ApplicationsResolver {
    constructor(applicationsService, messagesGateway, prismaService) {
        this.applicationsService = applicationsService;
        this.messagesGateway = messagesGateway;
        this.prismaService = prismaService;
    }
    async applyToRequest(user, input) {
        console.log('=== APPLY TO REQUEST REACHED ===');
        console.log('User:', JSON.stringify(user, null, 2));
        console.log('Input:', JSON.stringify(input, null, 2));
        try {
            const application = await this.applicationsService.apply(user.id, input);
            console.log('Application created successfully:', application);
            this.messagesGateway.emitNewApplication(input.requestId, application);
            return application;
        }
        catch (error) {
            console.error('Error in applyToRequest service:', error);
            throw error;
        }
    }
    async acceptApplication(user, applicationId) {
        const application = await this.applicationsService.accept(applicationId, user.id);
        this.messagesGateway.emitRequestStatusChange(application.request.id, 'IN_PROGRESS');
        this.messagesGateway.emitApplicationAccepted(applicationId, application);
        return application;
    }
    myApplications(user) {
        return this.applicationsService.myApplications(user.id);
    }
    async removeApplication(user, applicationId) {
        console.log('=== REMOVE APPLICATION REACHED ===');
        console.log('User:', JSON.stringify(user, null, 2));
        console.log('Application ID:', applicationId);
        try {
            const result = await this.applicationsService.removeApplication(applicationId, user.id);
            console.log('Application removed successfully:', result);
            this.messagesGateway.emitApplicationRemoved(applicationId, result);
            return result;
        }
        catch (error) {
            console.error('Error in removeApplication resolver:', error);
            throw error;
        }
    }
    async helper(application) {
        return this.prismaService.user.findUnique({
            where: { id: application.helperId },
        });
    }
    async request(application) {
        return this.prismaService.request.findUnique({
            where: { id: application.requestId },
        });
    }
};
exports.ApplicationsResolver = ApplicationsResolver;
__decorate([
    (0, graphql_1.Mutation)(() => application_dto_1.Application),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, application_dto_1.ApplyToRequestInput]),
    __metadata("design:returntype", Promise)
], ApplicationsResolver.prototype, "applyToRequest", null);
__decorate([
    (0, graphql_1.Mutation)(() => application_dto_1.Application),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('applicationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ApplicationsResolver.prototype, "acceptApplication", null);
__decorate([
    (0, graphql_1.Query)(() => [application_dto_1.Application]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ApplicationsResolver.prototype, "myApplications", null);
__decorate([
    (0, graphql_1.Mutation)(() => application_dto_1.RemoveApplicationResult),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('applicationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ApplicationsResolver.prototype, "removeApplication", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [application_dto_1.Application]),
    __metadata("design:returntype", Promise)
], ApplicationsResolver.prototype, "helper", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [application_dto_1.Application]),
    __metadata("design:returntype", Promise)
], ApplicationsResolver.prototype, "request", null);
exports.ApplicationsResolver = ApplicationsResolver = __decorate([
    (0, graphql_1.Resolver)(() => application_dto_1.Application),
    __metadata("design:paramtypes", [applications_service_1.ApplicationsService,
        messages_gateway_1.MessagesGateway,
        prisma_service_1.PrismaService])
], ApplicationsResolver);
//# sourceMappingURL=applications.resolver.js.map