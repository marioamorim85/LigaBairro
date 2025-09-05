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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = exports.SendMessageInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
const user_dto_1 = require("../../users/dto/user.dto");
let SendMessageInput = class SendMessageInput {
};
exports.SendMessageInput = SendMessageInput;
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)({ message: 'ID do pedido deve ser uma string' }),
    __metadata("design:type", String)
], SendMessageInput.prototype, "requestId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)({ message: 'Texto deve ser uma string' }),
    (0, class_validator_1.MinLength)(1, { message: 'Mensagem não pode estar vazia' }),
    (0, class_validator_1.MaxLength)(500, { message: 'Mensagem deve ter no máximo 500 caracteres' }),
    __metadata("design:type", String)
], SendMessageInput.prototype, "text", void 0);
exports.SendMessageInput = SendMessageInput = __decorate([
    (0, graphql_1.InputType)()
], SendMessageInput);
let Message = class Message {
};
exports.Message = Message;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Message.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Message.prototype, "requestId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Message.prototype, "senderId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Message.prototype, "text", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Message.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => user_dto_1.User, { nullable: true }),
    __metadata("design:type", user_dto_1.User)
], Message.prototype, "sender", void 0);
exports.Message = Message = __decorate([
    (0, graphql_1.ObjectType)()
], Message);
//# sourceMappingURL=message.dto.js.map