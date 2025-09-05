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
exports.NotificationsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const gql_auth_guard_1 = require("../auth/guards/gql-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const notifications_service_1 = require("./notifications.service");
const notification_dto_1 = require("./dto/notification.dto");
let NotificationsResolver = class NotificationsResolver {
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    async getUserNotifications(user, offset, limit) {
        return this.notificationsService.findByUserId(user.id, limit, offset);
    }
    async unreadNotificationsCount(user) {
        return this.notificationsService.getUnreadCount(user.id);
    }
    async markNotificationAsRead(user, id) {
        return this.notificationsService.markAsRead(id, user.id);
    }
    async markAllNotificationsAsRead(user) {
        await this.notificationsService.markAllAsRead(user.id);
        return true;
    }
};
exports.NotificationsResolver = NotificationsResolver;
__decorate([
    (0, graphql_1.Query)(() => [notification_dto_1.Notification]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('offset', { type: () => graphql_1.Int, defaultValue: 0 })),
    __param(2, (0, graphql_1.Args)('limit', { type: () => graphql_1.Int, defaultValue: 50 })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], NotificationsResolver.prototype, "getUserNotifications", null);
__decorate([
    (0, graphql_1.Query)(() => graphql_1.Int),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsResolver.prototype, "unreadNotificationsCount", null);
__decorate([
    (0, graphql_1.Mutation)(() => notification_dto_1.Notification),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], NotificationsResolver.prototype, "markNotificationAsRead", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsResolver.prototype, "markAllNotificationsAsRead", null);
exports.NotificationsResolver = NotificationsResolver = __decorate([
    (0, graphql_1.Resolver)(() => notification_dto_1.Notification),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsResolver);
//# sourceMappingURL=notifications.resolver.js.map