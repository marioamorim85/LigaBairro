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
exports.ReportsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const gql_auth_guard_1 = require("../auth/guards/gql-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const reports_service_1 = require("./reports.service");
const report_dto_1 = require("./dto/report.dto");
let ReportsResolver = class ReportsResolver {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    reportUser(user, input) {
        return this.reportsService.reportUser(user.id, input.targetUserId, input.reason, input.details);
    }
    reportRequest(user, input) {
        return this.reportsService.reportRequest(user.id, input.requestId, input.reason, input.details);
    }
    reports(user) {
        if (user.role !== 'ADMIN') {
            return [];
        }
        return this.reportsService.findAll();
    }
};
exports.ReportsResolver = ReportsResolver;
__decorate([
    (0, graphql_1.Mutation)(() => report_dto_1.Report),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, report_dto_1.ReportUserInput]),
    __metadata("design:returntype", void 0)
], ReportsResolver.prototype, "reportUser", null);
__decorate([
    (0, graphql_1.Mutation)(() => report_dto_1.Report),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, report_dto_1.ReportRequestInput]),
    __metadata("design:returntype", void 0)
], ReportsResolver.prototype, "reportRequest", null);
__decorate([
    (0, graphql_1.Query)(() => [report_dto_1.Report]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReportsResolver.prototype, "reports", null);
exports.ReportsResolver = ReportsResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsResolver);
//# sourceMappingURL=reports.resolver.js.map