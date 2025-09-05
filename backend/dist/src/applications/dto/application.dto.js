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
exports.RemoveApplicationResult = exports.Application = exports.ApplyToRequestInput = exports.ApplicationStatus = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
const user_dto_1 = require("../../users/dto/user.dto");
const request_dto_1 = require("../../requests/dto/request.dto");
var ApplicationStatus;
(function (ApplicationStatus) {
    ApplicationStatus["APPLIED"] = "APPLIED";
    ApplicationStatus["ACCEPTED"] = "ACCEPTED";
    ApplicationStatus["REJECTED"] = "REJECTED";
})(ApplicationStatus || (exports.ApplicationStatus = ApplicationStatus = {}));
let ApplyToRequestInput = class ApplyToRequestInput {
};
exports.ApplyToRequestInput = ApplyToRequestInput;
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)({ message: 'ID do pedido deve ser uma string' }),
    __metadata("design:type", String)
], ApplyToRequestInput.prototype, "requestId", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Mensagem deve ser uma string' }),
    (0, class_validator_1.MaxLength)(500, { message: 'Mensagem deve ter no máximo 500 caracteres' }),
    __metadata("design:type", String)
], ApplyToRequestInput.prototype, "message", void 0);
exports.ApplyToRequestInput = ApplyToRequestInput = __decorate([
    (0, graphql_1.InputType)()
], ApplyToRequestInput);
let Application = class Application {
};
exports.Application = Application;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Application.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Application.prototype, "requestId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Application.prototype, "helperId", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Application.prototype, "message", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Application.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Application.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => request_dto_1.Request, { nullable: true }),
    __metadata("design:type", request_dto_1.Request)
], Application.prototype, "request", void 0);
__decorate([
    (0, graphql_1.Field)(() => user_dto_1.User, { nullable: true }),
    __metadata("design:type", user_dto_1.User)
], Application.prototype, "helper", void 0);
exports.Application = Application = __decorate([
    (0, graphql_1.ObjectType)()
], Application);
let RemoveApplicationResult = class RemoveApplicationResult {
};
exports.RemoveApplicationResult = RemoveApplicationResult;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], RemoveApplicationResult.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], RemoveApplicationResult.prototype, "success", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], RemoveApplicationResult.prototype, "message", void 0);
exports.RemoveApplicationResult = RemoveApplicationResult = __decorate([
    (0, graphql_1.ObjectType)()
], RemoveApplicationResult);
//# sourceMappingURL=application.dto.js.map