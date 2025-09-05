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
exports.UserSkill = exports.Skill = exports.User = exports.UpdateUserSkillsInput = exports.UpdateUserInput = exports.CreateUserInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
let CreateUserInput = class CreateUserInput {
};
exports.CreateUserInput = CreateUserInput;
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)({ message: 'Nome deve ser uma string' }),
    (0, class_validator_1.MinLength)(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
    (0, class_validator_1.MaxLength)(50, { message: 'Nome deve ter no máximo 50 caracteres' }),
    __metadata("design:type", String)
], CreateUserInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Email deve ser válido' }),
    __metadata("design:type", String)
], CreateUserInput.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserInput.prototype, "googleId", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'URL do avatar deve ser uma string' }),
    (0, class_validator_1.IsUrl)({}, { message: 'URL do avatar deve ser válida' }),
    __metadata("design:type", String)
], CreateUserInput.prototype, "avatarUrl", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)({ message: 'Cidade deve ser uma string' }),
    __metadata("design:type", String)
], CreateUserInput.prototype, "city", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateUserInput.prototype, "lat", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateUserInput.prototype, "lng", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Bio deve ser uma string' }),
    (0, class_validator_1.MaxLength)(200, { message: 'Bio deve ter no máximo 200 caracteres' }),
    __metadata("design:type", String)
], CreateUserInput.prototype, "bio", void 0);
exports.CreateUserInput = CreateUserInput = __decorate([
    (0, graphql_1.InputType)()
], CreateUserInput);
let UpdateUserInput = class UpdateUserInput {
};
exports.UpdateUserInput = UpdateUserInput;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserInput.prototype, "bio", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserInput.prototype, "avatarUrl", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Latitude deve ser um número' }),
    (0, class_validator_1.IsLatitude)({ message: 'Latitude deve ser válida' }),
    __metadata("design:type", Number)
], UpdateUserInput.prototype, "lat", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Longitude deve ser um número' }),
    (0, class_validator_1.IsLongitude)({ message: 'Longitude deve ser válida' }),
    __metadata("design:type", Number)
], UpdateUserInput.prototype, "lng", void 0);
exports.UpdateUserInput = UpdateUserInput = __decorate([
    (0, graphql_1.InputType)()
], UpdateUserInput);
let UpdateUserSkillsInput = class UpdateUserSkillsInput {
};
exports.UpdateUserSkillsInput = UpdateUserSkillsInput;
__decorate([
    (0, graphql_1.Field)(() => [graphql_1.ID]),
    (0, class_validator_1.IsArray)({ message: 'Skills deve ser um array' }),
    __metadata("design:type", Array)
], UpdateUserSkillsInput.prototype, "skillIds", void 0);
exports.UpdateUserSkillsInput = UpdateUserSkillsInput = __decorate([
    (0, graphql_1.InputType)()
], UpdateUserSkillsInput);
let User = class User {
};
exports.User = User;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], User.prototype, "googleId", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "avatarUrl", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], User.prototype, "city", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "lat", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "lng", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "bio", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "ratingAvg", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => [UserSkill], { nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "skills", void 0);
exports.User = User = __decorate([
    (0, graphql_1.ObjectType)()
], User);
let Skill = class Skill {
};
exports.Skill = Skill;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Skill.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Skill.prototype, "name", void 0);
exports.Skill = Skill = __decorate([
    (0, graphql_1.ObjectType)()
], Skill);
let UserSkill = class UserSkill {
};
exports.UserSkill = UserSkill;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UserSkill.prototype, "userId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UserSkill.prototype, "skillId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Skill)
], UserSkill.prototype, "skill", void 0);
exports.UserSkill = UserSkill = __decorate([
    (0, graphql_1.ObjectType)()
], UserSkill);
//# sourceMappingURL=user.dto.js.map