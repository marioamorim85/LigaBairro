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
exports.Report = exports.ReportRequestInput = exports.ReportUserInput = exports.ReportReason = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
var ReportReason;
(function (ReportReason) {
    ReportReason["SPAM"] = "SPAM";
    ReportReason["INAPPROPRIATE"] = "INAPPROPRIATE";
    ReportReason["SCAM"] = "SCAM";
    ReportReason["HARASSMENT"] = "HARASSMENT";
    ReportReason["FAKE_PROFILE"] = "FAKE_PROFILE";
    ReportReason["OTHER"] = "OTHER";
})(ReportReason || (exports.ReportReason = ReportReason = {}));
let ReportUserInput = class ReportUserInput {
};
exports.ReportUserInput = ReportUserInput;
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)({ message: 'ID do usuário deve ser uma string' }),
    (0, class_validator_1.IsUUID)('4', { message: 'ID do usuário deve ser um UUID válido' }),
    __metadata("design:type", String)
], ReportUserInput.prototype, "targetUserId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)({ message: 'Motivo deve ser uma string' }),
    (0, class_validator_1.IsIn)(Object.values(ReportReason), { message: 'Motivo deve ser válido' }),
    __metadata("design:type", String)
], ReportUserInput.prototype, "reason", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsString)({ message: 'Detalhes deve ser uma string' }),
    (0, class_validator_1.MinLength)(10, { message: 'Detalhes devem ter pelo menos 10 caracteres' }),
    (0, class_validator_1.MaxLength)(500, { message: 'Detalhes devem ter no máximo 500 caracteres' }),
    __metadata("design:type", String)
], ReportUserInput.prototype, "details", void 0);
exports.ReportUserInput = ReportUserInput = __decorate([
    (0, graphql_1.InputType)()
], ReportUserInput);
let ReportRequestInput = class ReportRequestInput {
};
exports.ReportRequestInput = ReportRequestInput;
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)({ message: 'ID do pedido deve ser uma string' }),
    (0, class_validator_1.IsUUID)('4', { message: 'ID do pedido deve ser um UUID válido' }),
    __metadata("design:type", String)
], ReportRequestInput.prototype, "requestId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)({ message: 'Motivo deve ser uma string' }),
    (0, class_validator_1.IsIn)(Object.values(ReportReason), { message: 'Motivo deve ser válido' }),
    __metadata("design:type", String)
], ReportRequestInput.prototype, "reason", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsString)({ message: 'Detalhes deve ser uma string' }),
    (0, class_validator_1.MinLength)(10, { message: 'Detalhes devem ter pelo menos 10 caracteres' }),
    (0, class_validator_1.MaxLength)(500, { message: 'Detalhes devem ter no máximo 500 caracteres' }),
    __metadata("design:type", String)
], ReportRequestInput.prototype, "details", void 0);
exports.ReportRequestInput = ReportRequestInput = __decorate([
    (0, graphql_1.InputType)()
], ReportRequestInput);
let Report = class Report {
};
exports.Report = Report;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Report.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Report.prototype, "reporterId", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Report.prototype, "targetUserId", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Report.prototype, "requestId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Report.prototype, "reason", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Report.prototype, "details", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Report.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Report.prototype, "createdAt", void 0);
exports.Report = Report = __decorate([
    (0, graphql_1.ObjectType)()
], Report);
//# sourceMappingURL=report.dto.js.map