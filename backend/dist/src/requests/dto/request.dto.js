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
exports.Request = exports.SearchRequestsInput = exports.UpdateRequestInput = exports.CreateRequestInput = exports.RequestStatus = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
const user_dto_1 = require("../../users/dto/user.dto");
const application_dto_1 = require("../../applications/dto/application.dto");
const message_dto_1 = require("../../messages/dto/message.dto");
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["OPEN"] = "OPEN";
    RequestStatus["IN_PROGRESS"] = "IN_PROGRESS";
    RequestStatus["DONE"] = "DONE";
    RequestStatus["CANCELLED"] = "CANCELLED";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
let CreateRequestInput = class CreateRequestInput {
};
exports.CreateRequestInput = CreateRequestInput;
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)({ message: 'Título deve ser uma string' }),
    (0, class_validator_1.MinLength)(5, { message: 'Título deve ter pelo menos 5 caracteres' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Título deve ter no máximo 100 caracteres' }),
    __metadata("design:type", String)
], CreateRequestInput.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)({ message: 'Descrição deve ser uma string' }),
    (0, class_validator_1.MinLength)(20, { message: 'Descrição deve ter pelo menos 20 caracteres' }),
    (0, class_validator_1.MaxLength)(500, { message: 'Descrição deve ter no máximo 500 caracteres' }),
    __metadata("design:type", String)
], CreateRequestInput.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)({ message: 'Categoria deve ser uma string' }),
    (0, class_validator_1.IsIn)(['Compras', 'Reparações', 'Companhia a idosos', 'Limpezas', 'Jardinagem', 'Outros'], {
        message: 'Categoria deve ser uma das opções válidas'
    }),
    __metadata("design:type", String)
], CreateRequestInput.prototype, "category", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateRequestInput.prototype, "isPaid", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Orçamento deve ser um número' }),
    (0, class_validator_1.IsPositive)({ message: 'Orçamento deve ser positivo' }),
    (0, class_validator_1.Min)(100, { message: 'Orçamento mínimo é 1€' }),
    (0, class_validator_1.Max)(10000000, { message: 'Orçamento máximo é 100.000€' }),
    __metadata("design:type", Number)
], CreateRequestInput.prototype, "budgetCents", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateRequestInput.prototype, "scheduledFrom", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateRequestInput.prototype, "scheduledTo", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    (0, class_validator_1.IsNumber)({}, { message: 'Latitude deve ser um número' }),
    (0, class_validator_1.IsLatitude)({ message: 'Latitude deve ser válida' }),
    __metadata("design:type", Number)
], CreateRequestInput.prototype, "lat", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    (0, class_validator_1.IsNumber)({}, { message: 'Longitude deve ser um número' }),
    (0, class_validator_1.IsLongitude)({ message: 'Longitude deve ser válida' }),
    __metadata("design:type", Number)
], CreateRequestInput.prototype, "lng", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { defaultValue: [] }),
    (0, class_validator_1.IsArray)({ message: 'URLs das imagens deve ser um array' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateRequestInput.prototype, "imageUrls", void 0);
exports.CreateRequestInput = CreateRequestInput = __decorate([
    (0, graphql_1.InputType)()
], CreateRequestInput);
let UpdateRequestInput = class UpdateRequestInput {
};
exports.UpdateRequestInput = UpdateRequestInput;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Título deve ser uma string' }),
    (0, class_validator_1.MinLength)(5, { message: 'Título deve ter pelo menos 5 caracteres' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Título deve ter no máximo 100 caracteres' }),
    __metadata("design:type", String)
], UpdateRequestInput.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Descrição deve ser uma string' }),
    (0, class_validator_1.MinLength)(20, { message: 'Descrição deve ter pelo menos 20 caracteres' }),
    (0, class_validator_1.MaxLength)(500, { message: 'Descrição deve ter no máximo 500 caracteres' }),
    __metadata("design:type", String)
], UpdateRequestInput.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Categoria deve ser uma string' }),
    (0, class_validator_1.IsIn)(['Compras', 'Reparações', 'Companhia a idosos', 'Limpezas', 'Jardinagem', 'Outros'], {
        message: 'Categoria deve ser uma das opções válidas'
    }),
    __metadata("design:type", String)
], UpdateRequestInput.prototype, "category", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateRequestInput.prototype, "isPaid", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Orçamento deve ser um número' }),
    (0, class_validator_1.IsPositive)({ message: 'Orçamento deve ser positivo' }),
    (0, class_validator_1.Min)(100, { message: 'Orçamento mínimo é 1€' }),
    (0, class_validator_1.Max)(10000000, { message: 'Orçamento máximo é 100.000€' }),
    __metadata("design:type", Number)
], UpdateRequestInput.prototype, "budgetCents", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateRequestInput.prototype, "scheduledFrom", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateRequestInput.prototype, "scheduledTo", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'URLs das imagens deve ser um array' }),
    __metadata("design:type", Array)
], UpdateRequestInput.prototype, "imageUrls", void 0);
exports.UpdateRequestInput = UpdateRequestInput = __decorate([
    (0, graphql_1.InputType)()
], UpdateRequestInput);
let SearchRequestsInput = class SearchRequestsInput {
};
exports.SearchRequestsInput = SearchRequestsInput;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchRequestsInput.prototype, "category", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(RequestStatus),
    __metadata("design:type", String)
], SearchRequestsInput.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { defaultValue: 10 }),
    (0, class_validator_1.IsNumber)({}, { message: 'Limite deve ser um número' }),
    (0, class_validator_1.Min)(1, { message: 'Limite mínimo é 1' }),
    (0, class_validator_1.Max)(100, { message: 'Limite máximo é 100' }),
    __metadata("design:type", Number)
], SearchRequestsInput.prototype, "limit", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { defaultValue: 0 }),
    (0, class_validator_1.IsNumber)({}, { message: 'Offset deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'Offset deve ser 0 ou maior' }),
    __metadata("design:type", Number)
], SearchRequestsInput.prototype, "offset", void 0);
exports.SearchRequestsInput = SearchRequestsInput = __decorate([
    (0, graphql_1.InputType)()
], SearchRequestsInput);
let Request = class Request {
};
exports.Request = Request;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Request.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Request.prototype, "requesterId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Request.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Request.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Request.prototype, "category", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], Request.prototype, "isPaid", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], Request.prototype, "budgetCents", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Request.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], Request.prototype, "scheduledFrom", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], Request.prototype, "scheduledTo", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Request.prototype, "city", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], Request.prototype, "lat", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], Request.prototype, "lng", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Request.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Request.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], Request.prototype, "distance", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], Request.prototype, "imageUrls", void 0);
__decorate([
    (0, graphql_1.Field)(() => user_dto_1.User, { nullable: true }),
    __metadata("design:type", user_dto_1.User)
], Request.prototype, "requester", void 0);
__decorate([
    (0, graphql_1.Field)(() => [application_dto_1.Application], { nullable: true }),
    __metadata("design:type", Array)
], Request.prototype, "applications", void 0);
__decorate([
    (0, graphql_1.Field)(() => [message_dto_1.Message], { nullable: true }),
    __metadata("design:type", Array)
], Request.prototype, "messages", void 0);
exports.Request = Request = __decorate([
    (0, graphql_1.ObjectType)()
], Request);
//# sourceMappingURL=request.dto.js.map