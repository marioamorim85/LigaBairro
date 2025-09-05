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
exports.UserStats = exports.RatingDistribution = exports.Review = exports.CreateReviewInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
let CreateReviewInput = class CreateReviewInput {
};
exports.CreateReviewInput = CreateReviewInput;
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)({ message: 'ID do pedido deve ser uma string' }),
    __metadata("design:type", String)
], CreateReviewInput.prototype, "requestId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)({ message: 'ID do avaliado deve ser uma string' }),
    __metadata("design:type", String)
], CreateReviewInput.prototype, "revieweeId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, class_validator_1.IsInt)({ message: 'Avaliação deve ser um número inteiro' }),
    (0, class_validator_1.Min)(1, { message: 'Avaliação mínima é 1' }),
    (0, class_validator_1.Max)(5, { message: 'Avaliação máxima é 5' }),
    __metadata("design:type", Number)
], CreateReviewInput.prototype, "rating", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Comentário deve ser uma string' }),
    (0, class_validator_1.MinLength)(10, { message: 'Comentário deve ter pelo menos 10 caracteres' }),
    (0, class_validator_1.MaxLength)(300, { message: 'Comentário deve ter no máximo 300 caracteres' }),
    __metadata("design:type", String)
], CreateReviewInput.prototype, "comment", void 0);
exports.CreateReviewInput = CreateReviewInput = __decorate([
    (0, graphql_1.InputType)()
], CreateReviewInput);
let Review = class Review {
};
exports.Review = Review;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Review.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Review.prototype, "requestId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Review.prototype, "reviewerId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Review.prototype, "revieweeId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Review.prototype, "rating", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Review.prototype, "comment", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Review.prototype, "createdAt", void 0);
exports.Review = Review = __decorate([
    (0, graphql_1.ObjectType)()
], Review);
let RatingDistribution = class RatingDistribution {
};
exports.RatingDistribution = RatingDistribution;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], RatingDistribution.prototype, "rating1", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], RatingDistribution.prototype, "rating2", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], RatingDistribution.prototype, "rating3", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], RatingDistribution.prototype, "rating4", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], RatingDistribution.prototype, "rating5", void 0);
exports.RatingDistribution = RatingDistribution = __decorate([
    (0, graphql_1.ObjectType)()
], RatingDistribution);
let UserStats = class UserStats {
};
exports.UserStats = UserStats;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], UserStats.prototype, "totalReviews", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], UserStats.prototype, "averageRating", void 0);
__decorate([
    (0, graphql_1.Field)(() => RatingDistribution),
    __metadata("design:type", RatingDistribution)
], UserStats.prototype, "ratingDistribution", void 0);
exports.UserStats = UserStats = __decorate([
    (0, graphql_1.ObjectType)()
], UserStats);
//# sourceMappingURL=review.dto.js.map