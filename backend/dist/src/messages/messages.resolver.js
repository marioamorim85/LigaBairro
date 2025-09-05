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
exports.MessagesResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const gql_auth_guard_1 = require("../auth/guards/gql-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const messages_service_1 = require("./messages.service");
const messages_gateway_1 = require("./messages.gateway");
const message_dto_1 = require("./dto/message.dto");
const user_dto_1 = require("../users/dto/user.dto");
const prisma_service_1 = require("../common/prisma/prisma.service");
let MessagesResolver = class MessagesResolver {
    constructor(messagesService, messagesGateway, prismaService) {
        this.messagesService = messagesService;
        this.messagesGateway = messagesGateway;
        this.prismaService = prismaService;
    }
    messagesByRequest(user, requestId) {
        return this.messagesService.findByRequest(requestId, user.id);
    }
    async sendMessage(user, input) {
        const message = await this.messagesService.send(user.id, input);
        this.messagesGateway.server.to(`request:${input.requestId}`).emit('message:new', message);
        return message;
    }
    async sender(message) {
        return this.prismaService.user.findUnique({
            where: { id: message.senderId },
        });
    }
};
exports.MessagesResolver = MessagesResolver;
__decorate([
    (0, graphql_1.Query)(() => [message_dto_1.Message]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('requestId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MessagesResolver.prototype, "messagesByRequest", null);
__decorate([
    (0, graphql_1.Mutation)(() => message_dto_1.Message),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, message_dto_1.SendMessageInput]),
    __metadata("design:returntype", Promise)
], MessagesResolver.prototype, "sendMessage", null);
__decorate([
    (0, graphql_1.ResolveField)(() => user_dto_1.User),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [message_dto_1.Message]),
    __metadata("design:returntype", Promise)
], MessagesResolver.prototype, "sender", null);
exports.MessagesResolver = MessagesResolver = __decorate([
    (0, graphql_1.Resolver)(() => message_dto_1.Message),
    __metadata("design:paramtypes", [messages_service_1.MessagesService,
        messages_gateway_1.MessagesGateway,
        prisma_service_1.PrismaService])
], MessagesResolver);
//# sourceMappingURL=messages.resolver.js.map